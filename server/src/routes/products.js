
import express from 'express';
import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения!'));
    }
  }
});

// GET /api/products - Список товаров с фильтрами
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      size, 
      search, 
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;
    
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', v.id,
              'size', v.size,
              'color', v.color,
              'stockQty', v.stock_qty
            )
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Фильтр по категории
    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    // Фильтр по диапазону цен
    if (minPrice) {
      query += ` AND p.price >= $${paramIndex}`;
      params.push(parseInt(minPrice));
      paramIndex++;
    }
    
    if (maxPrice) {
      query += ` AND p.price <= $${paramIndex}`;
      params.push(parseInt(maxPrice));
      paramIndex++;
    }
    
    // Поиск по названию
    if (search) {
      query += ` AND p.name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Группировка
    query += ` GROUP BY p.id, c.name`;
    
    // Сортировка
    switch (sort) {
      case 'price-asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price-desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'popular':
        query += ` ORDER BY p.popular DESC, p.created_at DESC`;
        break;
      default:
        query += ` ORDER BY p.created_at DESC`;
    }
    
    // Пагинация
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);
    
    const result = await pool.query(query, params);
    
    // Получаем общее количество
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE 1=1
    `;
    const countParams = [];
    let countIndex = 1;
    
    if (category) {
      countQuery += ` AND c.slug = $${countIndex}`;
      countParams.push(category);
      countIndex++;
    }
    if (search) {
      countQuery += ` AND p.name ILIKE $${countIndex}`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      products: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// GET /api/products/:id - Товар по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', v.id,
              'size', v.size,
              'color', v.color,
              'stockQty', v.stock_qty
            )
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Ошибка при получении товара' });
  }
});

// POST /api/products - Создание товара (админ)
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, description, price, category_id, in_stock, badge, popular, variants } = req.body;
    
    // Сохраняем изображения
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    
    // Вставка товара
    const productResult = await client.query(`
      INSERT INTO products (name, description, price, category_id, images, in_stock, badge, popular)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      name,
      description,
      parseInt(price) || 0,
      category_id ? parseInt(category_id) : null,
      images,
      in_stock !== 'false',
      badge || null,
      popular === 'true'
    ]);
    
    const productId = productResult.rows[0].id;
    
    // Вставка вариантов
    if (variants) {
      const variantsArray = JSON.parse(variants);
      for (const v of variantsArray) {
        await client.query(`
          INSERT INTO product_variants (product_id, size, color, stock_qty)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (product_id, size, color) DO UPDATE SET stock_qty = $4
        `, [productId, v.size, v.color, parseInt(v.stockQty) || 0]);
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ id: productId, message: 'Товар создан' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Ошибка при создании товара' });
  } finally {
    client.release();
  }
});

// PUT /api/products/:id - Обновление товара (админ)
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { name, description, price, category_id, in_stock, badge, popular, variants, keepImages } = req.body;
    
    // Обработка изображений
    let images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      const existingImages = keepImages ? JSON.parse(keepImages) : [];
      images = [...existingImages, ...newImages];
    } else if (keepImages) {
      images = JSON.parse(keepImages);
    } else {
      images = [];
    }
    
    await client.query(`
      UPDATE products 
      SET name = $1, description = $2, price = $3, category_id = $4, 
          images = $5, in_stock = $6, badge = $7, popular = $8
      WHERE id = $9
    `, [
      name,
      description,
      parseInt(price) || 0,
      category_id ? parseInt(category_id) : null,
      images,
      in_stock !== 'false',
      badge || null,
      popular === 'true',
      id
    ]);
    
    // Обновление вариантов
    if (variants) {
      const variantsArray = JSON.parse(variants);
      // Удаляем старые варианты
      await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
      // Добавляем новые
      for (const v of variantsArray) {
        await client.query(`
          INSERT INTO product_variants (product_id, size, color, stock_qty)
          VALUES ($1, $2, $3, $4)
        `, [id, v.size, v.color, parseInt(v.stockQty) || 0]);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({ message: 'Товар обновлён' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  } finally {
    client.release();
  }
});

// DELETE /api/products/:id - Удаление товара (админ)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Товар удалён' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

export default router;

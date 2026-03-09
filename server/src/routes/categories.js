
import express from 'express';
import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Список категорий
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
});

// GET /api/categories/:id - Категория по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Ошибка при получении категории' });
  }
});

// POST /api/categories - Создание категории (админ)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, slug: providedSlug } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Название обязательно' });
    }
    
    const slug = providedSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^а-яa-z0-9-]/g, '');
    
    const result = await pool.query(`
      INSERT INTO categories (name, slug)
      VALUES ($1, $2)
      RETURNING *
    `, [name, slug]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Категория уже существует' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
});

// PUT /api/categories/:id - Обновление категории (админ)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug: providedSlug } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Название обязательно' });
    }
    
    const slug = providedSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^а-яa-z0-9-]/g, '');
    
    const result = await pool.query(`
      UPDATE categories 
      SET name = $1, slug = $2
      WHERE id = $3
      RETURNING *
    `, [name, slug, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Категория уже существует' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Ошибка при обновлении категории' });
  }
});

// DELETE /api/categories/:id - Удаление категории (админ)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Сначала обнуляем category_id у товаров
    await pool.query('UPDATE products SET category_id = NULL WHERE category_id = $1', [id]);
    
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    
    res.json({ message: 'Категория удалена' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
});

export default router;

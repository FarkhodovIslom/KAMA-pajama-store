
import express from 'express';
import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders - Создание заказа
router.post('/', async (req, res) => {
  try {
    const { customer_name, phone, comment, items, total_price } = req.body;
    
    if (!customer_name || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    
    const result = await pool.query(`
      INSERT INTO orders (customer_name, phone, comment, items, total_price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [customer_name, phone, comment || null, JSON.stringify(items), parseInt(total_price) || 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

// GET /api/orders - Список заказов (админ)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);
    
    const result = await pool.query(query, params);
    
    // Получаем общее количество
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND status = $1';
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

// GET /api/orders/:id - Заказ по ID (админ)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
});

// PUT /api/orders/:id/status - Обновление статуса заказа (админ)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }
    
    const result = await pool.query(`
      UPDATE orders SET status = $1 WHERE id = $2 RETURNING *
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
});

export default router;

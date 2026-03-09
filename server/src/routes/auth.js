
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const router = express.Router();

// POST /api/auth/login - Вход в админку
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' });
    }
    
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные credentials' });
    }
    
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверные credentials' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

// POST /api/auth/register - Регистрация админа
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(`
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username
    `, [username, hash]);
    
    res.status(201).json({ message: 'Админ создан', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    console.error('Error registering:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

// GET /api/auth/me - Проверка токена
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Нет токена' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({ username: decoded.username });
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
});

export default router;

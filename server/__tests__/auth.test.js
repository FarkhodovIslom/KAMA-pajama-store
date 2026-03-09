import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth.js';
import { mockPool } from './mocks/db.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Введите логин и пароль');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Введите логин и пароль');
    });

    it('should return 401 if user not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wrong', password: 'password' });
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Неверные credentials');
    });

    it('should return 401 if password is invalid', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: 'admin', password_hash: 'hash' }]
      });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong' });
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Неверные credentials');
    });

    it('should return token on successful login', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: 'admin', password_hash: 'hashed-password' }]
      });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('username', 'admin');
    });

    it('should return 500 on server error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB error'));
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Ошибка при входе');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'password' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Введите логин и пароль');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'admin' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Введите логин и пароль');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'admin', password: '123' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Пароль должен быть минимум 6 символов');
    });

    it('should create admin on successful registration', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 2, username: 'newadmin' }]
      });
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newadmin', password: 'password123' });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Админ создан');
    });

    it('should return 400 if username already exists', async () => {
      const error = { code: '23505' };
      mockPool.query.mockRejectedValueOnce(error);
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'existing', password: 'password123' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Пользователь уже существует');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Нет токена');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Неверный токен');
    });

    it('should return username if token is valid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('username');
    });
  });
});


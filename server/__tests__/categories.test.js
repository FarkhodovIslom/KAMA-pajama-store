import request from 'supertest';
import express from 'express';
import categoriesRouter from '../src/routes/categories.js';
import { mockPool } from './mocks/db.js';
import jwt from 'jsonwebtoken';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/categories', categoriesRouter);

// Generate valid token for protected routes
const validToken = 'valid-token';

describe('Categories Routes', () => {
  describe('GET /api/categories', () => {
    it('should return list of categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Женские', slug: 'women', products_count: '10' },
        { id: 2, name: 'Мужские', slug: 'men', products_count: '5' }
      ];
      mockPool.query.mockResolvedValueOnce({ rows: mockCategories });
      
      const res = await request(app).get('/api/categories');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategories);
    });

    it('should return empty array when no categories', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app).get('/api/categories');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return 500 on server error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB error'));
      
      const res = await request(app).get('/api/categories');
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Ошибка при получении категорий');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      const mockCategory = { id: 1, name: 'Женские', slug: 'women' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockCategory] });
      
      const res = await request(app).get('/api/categories/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app).get('/api/categories/999');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Категория не найдена');
    });
  });

  describe('POST /api/categories', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' });
      
      expect(res.status).toBe(401);
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Название обязательно');
    });

    it('should create category successfully', async () => {
      const mockCategory = { id: 3, name: 'Детские', slug: 'kids' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockCategory] });
      
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Детские' });
      
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockCategory);
    });

    it('should return 400 if category already exists', async () => {
      const error = { code: '23505' };
      mockPool.query.mockRejectedValueOnce(error);
      
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Existing' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Категория уже существует');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .put('/api/categories/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Название обязательно');
    });

    it('should update category successfully', async () => {
      const mockCategory = { id: 1, name: 'Обновленные', slug: 'updated' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockCategory] });
      
      const res = await request(app)
        .put('/api/categories/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Обновленные' });
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app)
        .put('/api/categories/999')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test' });
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Категория не найдена');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app).delete('/api/categories/1');
      
      expect(res.status).toBe(401);
    });

    it('should delete category successfully', async () => {
      mockPool.query.mockResolvedValueOnce({}); // UPDATE
      mockPool.query.mockResolvedValueOnce({}); // DELETE
      
      const res = await request(app)
        .delete('/api/categories/1')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Категория удалена');
    });
  });
});


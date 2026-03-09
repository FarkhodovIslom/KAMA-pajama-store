import request from 'supertest';
import express from 'express';
import productsRouter from '../src/routes/products.js';
import { mockPool } from './mocks/db.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

// Generate valid token for protected routes
const validToken = 'valid-token';

describe('Products Routes', () => {
  describe('GET /api/products', () => {
    it('should return list of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 1000, variants: [] },
        { id: 2, name: 'Product 2', price: 2000, variants: [] }
      ];
      mockPool.query
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ total: '2' }] });
      
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.products.length).toBe(2);
    });

    it('should filter products by category', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '0' }] });
      
      const res = await request(app).get('/api/products?category=women');
      
      expect(res.status).toBe(200);
      expect(mockPool.query).toHaveBeenCalled();
    });

    it('should filter products by price range', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '0' }] });
      
      const res = await request(app).get('/api/products?minPrice=100&maxPrice=500');
      
      expect(res.status).toBe(200);
    });

    it('should search products by name', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '0' }] });
      
      const res = await request(app).get('/api/products?search=пижама');
      
      expect(res.status).toBe(200);
    });

    it('should sort products by price', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '0' }] });
      
      const res = await request(app).get('/api/products?sort=price-asc');
      
      expect(res.status).toBe(200);
    });

    it('should paginate products', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '20' }] });
      
      const res = await request(app).get('/api/products?page=2&limit=10');
      
      expect(res.status).toBe(200);
      expect(res.body.page).toBe(2);
    });

    it('should return 500 on server error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB error'));
      
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Ошибка при получении товаров');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 1000, variants: [] };
      mockPool.query.mockResolvedValueOnce({ rows: [mockProduct] });
      
      const res = await request(app).get('/api/products/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app).get('/api/products/999');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Товар не найден');
    });
  });

  describe('POST /api/products', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test Product', price: 1000 });
      
      expect(res.status).toBe(401);
    });

    // Note: POST and PUT tests for products would require multipart form data
    // which is complex to test with supertest. Skipping for simplicity.
  });

  describe('DELETE /api/products/:id', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app).delete('/api/products/1');
      
      expect(res.status).toBe(401);
    });

    it('should delete product successfully', async () => {
      mockPool.query.mockResolvedValueOnce({});
      
      const res = await request(app)
        .delete('/api/products/1')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Товар удалён');
    });
  });
});


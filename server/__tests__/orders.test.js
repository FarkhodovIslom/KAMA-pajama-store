import request from 'supertest';
import express from 'express';
import ordersRouter from '../src/routes/orders.js';
import { mockPool } from './mocks/db.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);

// Generate valid token for protected routes
const validToken = 'valid-token';

describe('Orders Routes', () => {
  describe('POST /api/orders', () => {
    it('should return 400 if customer_name is missing', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ phone: '+1234567890', items: [] });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Заполните все обязательные поля');
    });

    it('should return 400 if phone is missing', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ customer_name: 'John', items: [] });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Заполните все обязательные поля');
    });

    it('should return 400 if items is empty', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ customer_name: 'John', phone: '+1234567890', items: [] });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Заполните все обязательные поля');
    });

    it('should create order successfully', async () => {
      const mockOrder = {
        id: 1,
        customer_name: 'John Doe',
        phone: '+1234567890',
        items: JSON.stringify([{ id: 1, name: 'Test', price: 1000 }]),
        total_price: 1000,
        status: 'new'
      };
      mockPool.query.mockResolvedValueOnce({ rows: [mockOrder] });
      
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'John Doe',
          phone: '+1234567890',
          items: [{ id: 1, name: 'Test', price: 1000 }],
          total_price: 1000
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('should create order with optional comment', async () => {
      const mockOrder = {
        id: 1,
        customer_name: 'John Doe',
        phone: '+1234567890',
        comment: 'Test comment',
        items: JSON.stringify([]),
        total_price: 1000,
        status: 'new'
      };
      mockPool.query.mockResolvedValueOnce({ rows: [mockOrder] });
      
      const res = await request(app)
        .post('/api/orders')
        .send({
          customer_name: 'John Doe',
          phone: '+1234567890',
          comment: 'Test comment',
          items: [],
          total_price: 1000
        });
      
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/orders', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app).get('/api/orders');
      
      expect(res.status).toBe(401);
    });

    it('should return list of orders', async () => {
      const mockOrders = [
        { id: 1, customer_name: 'John', status: 'new' },
        { id: 2, customer_name: 'Jane', status: 'processing' }
      ];
      mockPool.query
        .mockResolvedValueOnce({ rows: mockOrders }) // SELECT orders
        .mockResolvedValueOnce({ rows: [{ total: '2' }] }); // COUNT
      
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('orders');
    });

    it('should filter orders by status', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1, status: 'new' }] })
        .mockResolvedValueOnce({ rows: [{ total: '1' }] });
      
      const res = await request(app)
        .get('/api/orders?status=new')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app).get('/api/orders/1');
      
      expect(res.status).toBe(401);
    });

    it('should return order by id', async () => {
      const mockOrder = { id: 1, customer_name: 'John', status: 'new' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockOrder] });
      
      const res = await request(app)
        .get('/api/orders/1')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });

    it('should return 404 if order not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app)
        .get('/api/orders/999')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Заказ не найден');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should return 401 if no auth token', async () => {
      const res = await request(app)
        .put('/api/orders/1/status')
        .send({ status: 'completed' });
      
      expect(res.status).toBe(401);
    });

    it('should return 400 if status is invalid', async () => {
      const res = await request(app)
        .put('/api/orders/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'invalid' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Неверный статус');
    });

    it('should update status successfully', async () => {
      const mockOrder = { id: 1, status: 'completed' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockOrder] });
      
      const res = await request(app)
        .put('/api/orders/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'completed' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('completed');
    });

    it('should return 404 if order not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      
      const res = await request(app)
        .put('/api/orders/999/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'completed' });
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Заказ не найден');
    });

    it('should accept all valid statuses', async () => {
      const statuses = ['new', 'processing', 'completed', 'cancelled'];
      
      for (const status of statuses) {
        mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1, status }] });
        
        const res = await request(app)
          .put('/api/orders/1/status')
          .set('Authorization', `Bearer ${validToken}`)
          .send({ status });
        
        expect(res.status).toBe(200);
      }
    });
  });
});


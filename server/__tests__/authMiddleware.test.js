import jwt from 'jsonwebtoken';
import { authenticateToken } from '../src/middleware/auth.js';

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header', () => {
    authenticateToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Требуется авторизация' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is wrong', () => {
    req.headers.authorization = 'InvalidFormat';
    
    authenticateToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Требуется авторизация' });
  });

  it('should return 403 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });
    
    authenticateToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Неверный токен' });
  });

  it('should call next() and set user if token is valid', () => {
    req.headers.authorization = 'Bearer valid-token';
    const mockUser = { id: 1, username: 'admin' };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });
    
    authenticateToken(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
  });
});


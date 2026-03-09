// Jest setup file to mock modules before tests
import { mockPool, mockClient, resetMocks } from '../mocks/db.js';

// Mock the db.js module
jest.mock('../../src/config/db.js', () => ({
  pool: mockPool,
  initDatabase: jest.fn().mockResolvedValue(true)
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'valid-token') {
      callback(null, { id: 1, username: 'admin' });
    } else {
      callback(new Error('Invalid token'));
    }
  })
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === 'admin123');
  }),
  hash: jest.fn().mockResolvedValue('hashed-password')
}));

// Reset mocks before each test
beforeEach(() => {
  resetMocks();
});

export { mockPool, mockClient };


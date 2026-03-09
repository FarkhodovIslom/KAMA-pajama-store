import { jest } from '@jest/globals';

// Mock for database pool
const mockPool = {
  query: jest.fn(),
  connect: jest.fn()
};

// Mock client for transactions
const mockClient = {
  query: jest.fn(),
  release: jest.fn()
};

mockPool.connect.mockResolvedValue(mockClient);

export { mockPool, mockClient };

// Helper to reset all mocks
export function resetMocks() {
  mockPool.query.mockReset();
  mockClient.query.mockReset();
  mockPool.connect.mockReset();
  mockClient.release.mockReset();
}

// Helper to setup successful query responses
export function mockQuerySuccess(rows) {
  mockPool.query.mockResolvedValue({ rows });
  mockClient.query.mockResolvedValue({ rows });
}

// Helper to setup failed query responses
export function mockQueryError(error) {
  mockPool.query.mockRejectedValue(error);
  mockClient.query.mockRejectedValue(error);
}


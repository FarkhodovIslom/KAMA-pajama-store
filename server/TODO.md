# Backend Unit Tests Plan

## Information Gathered
The server has the following routes:
- **Auth** (`/api/auth`): login, register, me
- **Products** (`/api/products`): CRUD with filters, pagination
- **Categories** (`/api/categories`): CRUD operations
- **Orders** (`/api/orders`): create, list, get by id, update status

## Plan
1. Install testing dependencies (jest, supertest, jest-mock)
2. Create test configuration (jest.config.js)
3. Create mocks for database (pool)
4. Write unit tests for:
   - Auth routes (login, register, me)
   - Categories routes (CRUD)
   - Orders routes (create, list, update status)
   - Products routes (list, get by id)
   - Auth middleware

## Test Strategy
- Use `supertest` for HTTP testing
- Mock the database pool to avoid real DB connections
- Test HTTP status codes, response structure, error handling


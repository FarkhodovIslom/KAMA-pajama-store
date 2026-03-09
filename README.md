# 🛏️ Pijama Store — Online Pajama Shop

Full-stack e-commerce application for selling pajamas and sleepwear. Built with React (Vite), Express, and PostgreSQL.

![Project Status](https://img.shields.io/badge/status-active-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📁 Project Structure

```
kss/                    # Root project directory
├── client/             # Frontend (React + Vite + Tailwind CSS)
├── server/             # Backend (Express + PostgreSQL)
└── README.md           # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** or **yarn**

### Backend Setup

```bash
cd server
npm install

# Create PostgreSQL database
createdb pijama_store

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

Server runs at: `http://localhost:3001`

### Frontend Setup

```bash
cd client
npm install

# Start development server
npm run dev
```

Client runs at: `http://localhost:5173`

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router DOM | Routing |
| React Hook Form | Form Handling |
| Zod | Schema Validation |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | Web Framework |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Uploads |
| pg | PostgreSQL Client |

---

## 📦 Environment Variables

### Server (`.env`)

```env
# Server
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pijama_store
DB_USER=postgres
DB_PASSWORD=postgres
```

### Client

Create `.env` in client directory if needed for API URL:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🗄️ Database Schema

### Tables

- **categories** — Product categories (women, men, kids)
- **products** — Main product catalog
- **product_variants** — Size/color variants with stock
- **orders** — Customer orders with items
- **admins** — Admin users for dashboard

### Default Admin Account

```
Username: admin
Password: admin123
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/register` | Register new admin |
| GET | `/api/auth/me` | Verify JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | List all orders (admin) |
| GET | `/api/orders/:id` | Get order by ID (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

---

## 🔍 Product Filters

```
GET /api/products?category=women&minPrice=50000&maxPrice=100000&size=M&search=пижама&sort=price-asc&page=1&limit=20
```

### Filter Parameters
- `category` — Category slug (women, men, kids)
- `minPrice` — Minimum price (in cents)
- `maxPrice` — Maximum price (in cents)
- `size` — Product size (XS, S, M, L, XL)
- `color` — Product color
- `search` — Search in name/description
- `sort` — Sorting (price-asc, price-desc, newest, popular)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20)

---

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

Tests use Jest with supertest for API endpoint testing.

---

## 📱 Features

### Customer Features
- Browse products by category
- Filter by size, color, price
- Search products
- View product details with image gallery
- Add to cart
- Place orders

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management with status updates
- Image uploads for products

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Default Admin

```
Username: admin
Password: admin123
```

**⚠️ Change the default admin password in production!**

---

## 🏗️ Project Overview

This is a full-stack e-commerce application with:

1. **Client** — Modern React SPA with Tailwind CSS, routing, and state management
2. **Server** — RESTful API with Express and PostgreSQL
3. **Authentication** — JWT-based admin authentication
4. **File Uploads** — Multer for product images
5. **Database** — PostgreSQL with auto-initialization

For more details about the backend API, see [server/README.md](./server/README.md).


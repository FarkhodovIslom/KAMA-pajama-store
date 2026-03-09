
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'pijama_store',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

export async function initDatabase() {
  const client = await pool.connect();
  
  try {
    // Создание таблиц
    await client.query(`
      -- Таблица категорий
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Таблица товаров
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        images TEXT[] DEFAULT '{}',
        in_stock BOOLEAN DEFAULT true,
        badge VARCHAR(50),
        popular BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Таблица вариантов товаров (размеры, цвета)
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        size VARCHAR(20) NOT NULL,
        color VARCHAR(50) NOT NULL,
        stock_qty INTEGER DEFAULT 0,
        UNIQUE(product_id, size, color)
      );
      
      -- Таблица заказов
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        comment TEXT,
        items JSONB NOT NULL,
        total_price INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Таблица админов
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Индексы для производительности
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
      CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
    `);
    
    // Вставка дефолтных категорий
    const existingCategories = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(existingCategories.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categories (name, slug) VALUES 
        ('Женские', 'women'),
        ('Мужские', 'men'),
        ('Детские', 'kids')
      `);
      console.log('✅ Добавлены дефолтные категории');
    }
    
    // Вставка дефолтного админа (пароль: admin123)
    const existingAdmins = await client.query('SELECT COUNT(*) FROM admins');
    if (parseInt(existingAdmins.rows[0].count) === 0) {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.default.hash('admin123', 10);
      await client.query(`
        INSERT INTO admins (username, password_hash) VALUES ('admin', $1)
      `, [hash]);
      console.log('✅ Добавлен дефолтный админ (admin/admin123)');
    }
    
    console.log('✅ Все таблицы созданы');
  } finally {
    client.release();
  }
}

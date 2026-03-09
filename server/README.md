
# Pijama Store API

Backend для магазина пижам.

## Запуск

```bash
cd server
npm install
# Создайте базу данных PostgreSQL:
# createdb pijama_store
npm run dev
```

## Переменные окружения

См. файл `.env`

## API Endpoints

### Авторизация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация (осторожно!)
- `GET /api/auth/me` - Проверка токена

### Товары
- `GET /api/products` - Список товаров (с фильтрами)
- `GET /api/products/:id` - Товар по ID
- `POST /api/products` - Создать товар (админ, с images)
- `PUT /api/products/:id` - Обновить товар (админ)
- `DELETE /api/products/:id` - Удалить товар (админ)

### Категории
- `GET /api/categories` - Список категорий
- `GET /api/categories/:id` - Категория по ID
- `POST /api/categories` - Создать категорию (админ)
- `PUT /api/categories/:id` - Обновить категорию (админ)
- `DELETE /api/categories/:id` - Удалить категорию (админ)

### Заказы
- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Список заказов (админ)
- `GET /api/orders/:id` - Заказ по ID (админ)
- `PUT /api/orders/:id/status` - Обновить статус (админ)

## Фильтры товаров

```
GET /api/products?category=women&minPrice=50000&maxPrice=100000&size=M&search=пижама&sort=price-asc&page=1&limit=20
```


import { Routes, Route } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { SearchPage } from './pages/SearchPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductNewPage } from './pages/admin/AdminProductNewPage';

function App() {
  return (
    <Routes>
      {/* Каталог */}
      <Route path="/" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/search" element={<SearchPage />} />
      
      {/* Админ */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/products/new" element={<AdminProductNewPage />} />
      <Route path="/admin/products/:id/edit" element={<AdminProductNewPage />} />
    </Routes>
  );
}

export default App;

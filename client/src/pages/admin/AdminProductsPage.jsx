
import { Navigate } from 'react-router-dom';
import { ProductsTable } from '../../components/admin/ProductsTable';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';

export function AdminProductsPage() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <AdminLayout>
      <h1 className="font-borel text-3xl mb-8">Товары</h1>
      <ProductsTable />
    </AdminLayout>
  );
}

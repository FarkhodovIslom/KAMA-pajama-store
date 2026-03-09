
import { Navigate } from 'react-router-dom';
import { OrdersTable } from '../../components/admin/OrdersTable';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';

export function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <AdminLayout>
      <h1 className="font-borel text-3xl mb-8">Заказы</h1>
      <OrdersTable />
    </AdminLayout>
  );
}

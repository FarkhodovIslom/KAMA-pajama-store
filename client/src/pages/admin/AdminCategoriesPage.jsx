
import { Navigate } from 'react-router-dom';
import { CategoriesTable } from '../../components/admin/CategoriesTable';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';

export function AdminCategoriesPage() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <AdminLayout>
      <h1 className="font-borel text-3xl mb-8">Категории</h1>
      <CategoriesTable />
    </AdminLayout>
  );
}

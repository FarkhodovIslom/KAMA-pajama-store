import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Package, ShoppingCart, LogOut, FolderOpen } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFan } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/admin/products', label: 'Товары', icon: Package },
  { path: '/admin/categories', label: 'Категории', icon: FolderOpen },
  { path: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
];

export function AdminLayout({ children }) {
  const location = useLocation();
  const { logout, username } = useAuth();
  
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-surface h-screen shadow-soft flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-borel text-2xl text-primary-dark flex items-center gap-2">
            <FontAwesomeIcon icon={faFan} className="text-primary" /> SweetDream
          </Link>
          <p className="text-xs text-text-muted mt-1">Админ-панель {username ? `(${username})` : ''}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-button font-semibold transition-all',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:bg-subtle hover:text-text-primary'
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-button font-semibold text-text-muted hover:bg-red-50 hover:text-red-500 w-full transition-all"
          >
            <LogOut size={20} />
            Выйти
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}

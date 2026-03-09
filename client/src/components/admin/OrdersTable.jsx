
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Package, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

export function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await api.get('/api/orders');
        if (active) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchOrders();
    return () => { active = false; };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.put(`/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: updated.status } : o));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Ошибка при обновлении статуса');
    }
  };
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ru', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading) {
    return <div className="text-center py-12 text-text-muted">Загрузка заказов...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-text-muted mb-4" />
        <p className="text-text-muted">Заказов пока нет</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-card p-5 shadow-soft"
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h3 className="font-extrabold text-lg">Заказ #{order.id}</h3>
              <p className="text-sm text-text-muted">{formatDate(order.created_at || order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-badge text-xs font-bold ${
                order.status === 'new' 
                  ? 'bg-primary text-white' 
                  : 'bg-[#C8E8CC] text-[#2D5A3D]'
              }`}>
                {order.status === 'new' ? 'Новый' : 'Обработан'}
              </span>
              {order.status === 'new' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(order.id, 'completed')}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Отметить
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{order.customer_name || order.name}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Phone size={16} />
              <a href={`tel:${order.phone}`} className="hover:text-primary-dark">
                {order.phone}
              </a>
            </div>
          </div>
          
          {order.comment && (
            <div className="flex items-start gap-2 text-sm text-text-muted bg-subtle rounded-lg p-3 mb-4">
              <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
              <span>{order.comment}</span>
            </div>
          )}
          
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-sm mb-2">Состав заказа:</h4>
            <div className="space-y-2">
              {Array.isArray(order.items) && order.items.map((item, idx) => {
                const product = item.product || {};
                const variant = item.variant || {};
                const name = product.name || 'Неизвестный товар';
                const size = variant.size || '-';
                const color = variant.color || '-';
                const price = item.price || product.price || 0;
                const qty = item.quantity || 1;

                return (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-muted">
                      {name} ({size}, {color}) × {qty}
                    </span>
                    <span className="font-bold">{price * qty} сум</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-border font-extrabold text-lg text-primary-dark">
              <span>Итого:</span>
              <span>{order.total_price || order.totalPrice} сум</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

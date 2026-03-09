
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartItem } from '../components/cart/CartItem';
import { OrderForm } from '../components/cart/OrderForm';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';

export function CartPage() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  
  if (order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
            <h1 className="font-borel text-3xl mb-4">Спасибо за заказ!</h1>
            <p className="text-text-muted mb-6">
              Заказ #{order.id} оформлен. Мы свяжемся с вами в ближайшее время.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                Имя: <span className="font-bold text-text-primary">{order.name}</span>
              </p>
              <p className="text-sm text-text-muted">
                Телефон: <span className="font-bold text-text-primary">{order.phone}</span>
              </p>
              <p className="text-sm text-text-muted">
                Сумма: <span className="font-bold text-primary-dark">{formatPrice(order.totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-3 mt-8 justify-center">
              <Button variant="ghost" onClick={() => navigate('/')}>
                На главную
              </Button>
              <Button onClick={() => setOrder(null)}>
                Новый заказ
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6"
        >
          <ArrowLeft size={18} />
          Назад
        </button>
        
        <h1 className="font-borel text-3xl mb-8">Корзина</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-muted text-lg mb-6">Корзина пуста</p>
            <Link to="/">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cart items */}
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <CartItem key={`${item.product.id}-${item.variant.id}`} item={item} />
                ))}
              </AnimatePresence>
            </div>
            
            {/* Order form */}
            <div>
              <OrderForm onSuccess={setOrder} />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

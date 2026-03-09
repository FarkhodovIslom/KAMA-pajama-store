
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShoppingBag, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { api } from '../../lib/api';

const orderSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(10, 'Введите номер телефона'),
  comment: z.string().optional(),
});

export function OrderForm({ onSuccess }) {
  const { cart, totalPrice, clearCart } = useCart();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      const response = await api.post('/api/orders', {
        customer_name: data.name,
        phone: data.phone,
        comment: data.comment,
        items: cart,
        total_price: totalPrice,
      });
      
      clearCart();
      // Map backend response fields to match UI expectations in CartPage
      onSuccess({
        id: response.id,
        name: response.customer_name,
        phone: response.phone,
        totalPrice: response.total_price,
      });
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={48} className="mx-auto text-text-muted mb-4" />
        <p className="text-text-muted">Корзина пуста</p>
      </div>
    );
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface rounded-card p-6 shadow-soft space-y-4"
    >
      <h3 className="font-borel text-xl mb-4">Оформить заказ</h3>
      
      <div>
        <Input
          placeholder="Ваше имя"
          {...register('name')}
          error={errors.name?.message}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Input
          placeholder="Телефон"
          {...register('phone')}
          error={errors.phone?.message}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>
      
      <div>
        <textarea
          placeholder="Комментарий к заказу (необязательно)"
          {...register('comment')}
          className="w-full px-4 py-3 rounded-button bg-[#FEF8F6] border border-border placeholder:text-text-muted text-text-primary resize-none h-24 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-muted">Итого:</span>
          <span className="font-extrabold text-2xl text-primary-dark">
            {formatPrice(totalPrice)}
          </span>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Отправка...'
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Отправить заказ
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}


import { createContext, useContext, useReducer, useEffect } from 'react';


const CartContext = createContext(null);

const CART_STORAGE_KEY = 'pijama-cart';

const getInitialCart = () => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = action.payload;
      const existingIndex = state.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );
      
      if (existingIndex >= 0) {
        newState = state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newState = [...state, { product, variant, quantity }];
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      newState = state.filter(
        item => !(item.product.id === productId && item.variant.id === variantId)
      );
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter(
          item => !(item.product.id === productId && item.variant.id === variantId)
        );
      } else {
        newState = state.map(item =>
          item.product.id === productId && item.variant.id === variantId
            ? { ...item, quantity }
            : item
        );
      }
      break;
    }
    
    case 'CLEAR_CART':
      newState = [];
      break;
    
    default:
      return state;
  }
  
  saveCart(newState);
  return newState;
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);
  
  const addItem = (product, variant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
  };
  
  const removeItem = (productId, variantId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
  };
  
  const updateQuantity = (productId, variantId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

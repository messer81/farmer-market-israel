import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import i18n from '../../i18n';

interface CartItem extends Product {
  quantity: number;
}

// Добавляем новые поля для управления состоянием корзины и оформления заказа через Redux
interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  showCheckout: boolean; // Показывать ли оформление заказа
  authOpen: boolean;     // Показывать ли окно авторизации
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
  showCheckout: false, // По умолчанию оформление заказа закрыто
  authOpen: false,     // По умолчанию окно авторизации закрыто
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      // Если есть поле total, пересчитываем его так:
      // state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setShowCheckout: (state, action: PayloadAction<boolean>) => {
      // Управляет показом оформления заказа (CheckoutPage)
      state.showCheckout = action.payload;
    },
    setAuthOpen: (state, action: PayloadAction<boolean>) => {
      // Управляет показом окна авторизации
      state.authOpen = action.payload;
    },
  },
});

// Экспортируем экшены для управления состоянием корзины и оформления заказа
export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, setShowCheckout, setAuthOpen } = cartSlice.actions;
export default cartSlice.reducer; 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';
import i18n from '../../i18n';

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      // Определяем язык и формируем name/description
      const lang = i18n.language || 'en';
      const p = action.payload as any;
      const name =
        (typeof p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
        p.nameEn || p.nameRu || p.nameHe || '';
      const description =
        (typeof p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
        p.descriptionEn || p.descriptionRu || p.descriptionHe || '';
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: { ...action.payload, name, description }, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer; 
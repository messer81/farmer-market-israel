import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './slices/productsSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import languageSlice from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlice,
    user: userSlice,
    language: languageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
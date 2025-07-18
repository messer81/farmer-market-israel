import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './slices/productsSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import Grid from '@mui/material/Grid';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
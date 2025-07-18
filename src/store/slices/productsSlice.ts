import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductCategory } from '../../types';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  searchTerm: string;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
  searchTerm: '',
};

// 🌐 Асинхронный экшен для загрузки продуктов
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    // Временно используем моковые данные из public/mock.json
    const response = await fetch('/mock.json');
    return response.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<ProductCategory | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearFilters: (state) => {
      state.selectedCategory = null;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSelectedCategory, setSearchTerm, clearFilters } = productsSlice.actions;
export default productsSlice.reducer; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductCategory } from '../../types';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
    try {
      // Загружаем данные из Firestore
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          nameHe: data.nameHe,
          price: data.price,
          currency: 'ILS',
          category: data.category,
          description: data.description,
          image: data.image,
          farmId: data.farmId || '',
          farmName: data.farmName,
          location: data.location,
          organic: data.organic,
          inStock: data.inStock,
          unit: data.unit
        });
      });
      
      return products;
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      throw error;
    }
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
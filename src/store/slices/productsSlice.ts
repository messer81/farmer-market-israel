import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Product, ProductCategory } from '../../types';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  searchTerm: string;
  lastFetched: number | null; // Время последней загрузки
  cache: Record<string, any>; // Кэш для оптимизации
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
  searchTerm: '',
  lastFetched: null,
  cache: {},
};

// 🌐 Асинхронный экшен для загрузки продуктов с улучшенным кэшированием
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    console.log('🔄 fetchProducts: Starting...');
    const state = getState() as { products: ProductsState };
    const { lastFetched, items } = state.products;
    
    // Уменьшаем время кэширования для более свежих данных
    const CACHE_DURATION = 5 * 60 * 1000; // 5 минут вместо 10
    const now = Date.now();
    
    // Если данные загружены недавно и есть товары, возвращаем кэшированные
    if (lastFetched && (now - lastFetched) < CACHE_DURATION && items.length > 0) {
      console.log('📦 fetchProducts: Using cached data, items:', items.length);
      return items;
    }
    
    try {
      // Загружаем данные из Firestore с оптимизацией
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      
      // Обрабатываем данные пакетами для лучшей производительности
      const batchSize = 10;
      const docs = querySnapshot.docs;
      
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);
        
        batch.forEach((doc) => {
          const data = doc.data();
          products.push({
            id: doc.id,
            name: data.name,
            nameEn: data.nameEn,
            nameRu: data.nameRu,
            nameHe: data.nameHe,
            price: data.price,
            currency: 'ILS',
            category: data.category,
            description: data.description,
            descriptionEn: data.descriptionEn,
            descriptionRu: data.descriptionRu,
            descriptionHe: data.descriptionHe,
            image: data.image,
            farmId: data.farmId || '',
            farmName: data.farmName,
            location: data.location,
            organic: data.organic,
            inStock: data.inStock,
            unit: data.unit
          });
        });
        
        // Небольшая пауза между пакетами для предотвращения блокировки UI
        if (i + batchSize < docs.length) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
      
      return products;
    } catch (error) {
      throw error;
    }
  }
);

// 🎯 Селекторы для оптимизации производительности
export const selectAllProducts = (state: { products: ProductsState }) => state.products.items;
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.loading;
export const selectProductsError = (state: { products: ProductsState }) => state.products.error;
export const selectSelectedCategory = (state: { products: ProductsState }) => state.products.selectedCategory;
export const selectSearchTerm = (state: { products: ProductsState }) => state.products.searchTerm;

// Мемоизированный селектор для фильтрованных товаров
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSelectedCategory, selectSearchTerm],
  (items, selectedCategory, searchTerm) => {
    return items.filter(product => {
      const p = product as any;
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        (typeof p.nameRu === 'string' && p.nameRu.toLowerCase().includes(search)) ||
        (typeof p.nameEn === 'string' && p.nameEn.toLowerCase().includes(search)) ||
        (typeof p.nameHe === 'string' && p.nameHe.includes(search));
      return matchesCategory && matchesSearch;
    });
  }
);

// Селектор для статистики
export const selectProductsStats = createSelector(
  [selectAllProducts, selectFilteredProducts],
  (allProducts, filteredProducts) => ({
    total: allProducts.length,
    filtered: filteredProducts.length,
    categories: Array.from(new Set(allProducts.map(p => (p as any).category))),
  })
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
    clearCache: (state) => {
      state.cache = {};
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('✅ fetchProducts: Fulfilled, items:', action.payload.length);
        state.loading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error('❌ fetchProducts: Rejected, error:', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSelectedCategory, setSearchTerm, clearFilters, clearCache } = productsSlice.actions;
export default productsSlice.reducer; 
import React, { useEffect, useMemo, useCallback, Suspense, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';

import { Search, Add, Spa, Store } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchProducts, 
  setSearchTerm, 
  setSelectedCategory,
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectSelectedCategory,
  selectSearchTerm
} from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Product, ProductCategory } from '../../types';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useFlyingAnimation } from '../../hooks/useFlyingAnimation';
import { useDebounce } from '../../hooks/usePerformanceOptimization';

// Ленивая загрузка тяжёлых компонентов
const FlyingProduct = React.lazy(() => import('../common/FlyingProduct'));
const OptimizedImage = React.lazy(() => import('../common/OptimizedImage'));
const SimpleImage = React.lazy(() => import('../common/SimpleImage'));

interface ProductCatalogProps {
  cartRef: React.RefObject<HTMLButtonElement | null>;
}

// Компонент карточки товара с мемоизацией
const ProductCard = React.memo<{
  product: Product;
  lang: string;
  getCategoryEmoji: (category: ProductCategory) => string;
  onAddToCart: (product: Product, cardElement: HTMLElement) => void;
  t: (key: string) => string;
  isPriority?: boolean; // Новый проп для приоритетной загрузки
}>(({ product, lang, getCategoryEmoji, onAddToCart, t, isPriority = false }) => {
  const p = product as any;
  const name =
    (typeof p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
    p.nameEn || p.nameRu || p.nameHe || '';
  const description =
    (typeof p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
    p.descriptionEn || p.descriptionRu || p.descriptionHe || '';

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    const cardElement = e.currentTarget.closest('.MuiCard-root') as HTMLElement;
    if (cardElement) {
      onAddToCart(product, cardElement);
    }
  }, [product, onAddToCart]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
          // Фиксированные размеры для предотвращения CLS
          minHeight: '400px',
          maxHeight: '400px',
        }}
      >
        <Box sx={{ 
          height: '200px', 
          minHeight: '200px', 
          maxHeight: '200px',
          overflow: 'hidden'
        }}>
          <Suspense fallback={<CircularProgress size={20} />}>
            <SimpleImage
              src={p.image}
              alt={name}
              height={200}
              objectFit="cover"
              borderRadius={0}
              priority={isPriority} // Приоритетная загрузка для первых элементов
            />
          </Suspense>
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1,
          // Фиксированные размеры для предотвращения CLS
          minHeight: '150px',
          maxHeight: '150px',
          overflow: 'hidden'
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {getCategoryEmoji(p.category)} {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {p.organic && (
              <Chip icon={<Spa />} label="Organic" size="small" color="success" />
            )}
            <Chip icon={<Store />} label={p.farmName} size="small" variant="outlined" />
          </Box>
          
          <Typography variant="h6" color="primary" gutterBottom>
            ₪{p.price} / {p.unit}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            📍 {p.location}
          </Typography>
        </CardContent>
        
        <Box sx={{ 
          p: 2, 
          pt: 0,
          // Фиксированные размеры для предотвращения CLS
          minHeight: '60px',
          maxHeight: '60px'
        }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            sx={{ 
              backgroundColor: '#4CAF50',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#45a049',
                transform: 'scale(1.02)',
              }
            }}
          >
            {product.inStock ? t('add_to_cart') : 'אזל במלאי Out of Stock'}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
});

ProductCard.displayName = 'ProductCard';

const ProductCatalog: React.FC<ProductCatalogProps> = ({ cartRef }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchTerm = useAppSelector(selectSearchTerm);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const { t } = useTranslation();
  
  // Хук для анимации перелёта
  const {
    isFlying,
    flyingPosition,
    productImage,
    triggerAnimation,
    resetAnimation,
  } = useFlyingAnimation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Мемоизируем обработчик добавления в корзину
  const handleAddToCart = useCallback((product: Product, cardElement: HTMLElement) => {
    
    if (!cartRef.current) {
      console.error('❌ Ссылка на корзину не найдена!');
      return;
    }

    // Добавляем товар в корзину
    dispatch(addToCart(product));
    
    // Запускаем анимацию
    triggerAnimation(product.image, cardElement, cartRef.current);
  }, [dispatch, triggerAnimation, cartRef]);

  // Мемоизируем функцию получения эмодзи категории
  const getCategoryEmoji = useCallback((category: ProductCategory) => {
    const emojis = {
      [ProductCategory.VEGETABLES]: '🥬',
      [ProductCategory.FRUITS]: '🍎',
      [ProductCategory.HERBS]: '🌿',
      [ProductCategory.DAIRY]: '🥛',
      [ProductCategory.HONEY]: '🍯',
      [ProductCategory.FLOWERS]: '🌸',
    };
    return emojis[category] || '🌾';
  }, []);

  // Мемоизируем текущий язык
  const lang = useMemo(() => i18n.language || 'en', [i18n.language]);

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Загружаем товары...
        </Typography>
      </Box>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки товаров: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => dispatch(fetchProducts())}
          sx={{ backgroundColor: '#4CAF50' }}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🔍 Фильтры */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextField
          placeholder={t('search_products')}
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 300,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            borderRadius: 2,
            '& .MuiInputBase-root': {
              borderRadius: 2,
              background: 'transparent',
            },
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('category')}</InputLabel>
          <Select
            value={selectedCategory || ''}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value as ProductCategory || null))}
            label={t('category')}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              },
            }}
          >
            <MenuItem value="">{t('all_categories')}</MenuItem>
            {Object.values(ProductCategory).map((category) => (
              <MenuItem key={category} value={category}>
                {getCategoryEmoji(category)} {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 📦 Каталог товаров */}
      {filteredProducts.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            Товары не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Попробуйте изменить фильтры поиска
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              getCategoryEmoji={getCategoryEmoji}
              onAddToCart={handleAddToCart}
              t={t}
              isPriority={index < 4} // Приоритетная загрузка для первых 4 элементов
            />
          ))}
        </Grid>
      )}

      {/* 🎯 Анимация перелёта товара (React Spring) */}
      {isFlying && flyingPosition.start && flyingPosition.end && productImage && (
        <Suspense fallback={null}>
          <FlyingProduct
            isVisible={isFlying}
            productImage={productImage}
            startPosition={flyingPosition.start}
            endPosition={flyingPosition.end}
            arcPosition={flyingPosition.arc || undefined}
            onComplete={resetAnimation}
          />
        </Suspense>
      )}
    </Box>
  );
};

export default ProductCatalog; 
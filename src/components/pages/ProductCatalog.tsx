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
  Divider,
} from '@mui/material';

import { Search, Add, Spa, Store, AccountCircle, LocationOn, Star } from '@mui/icons-material';
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

// Импортируем необходимые хуки и компоненты
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from '../common/ProductCard';

// Ленивая загрузка тяжёлых компонентов
const FlyingProduct = React.lazy(() => import('../common/FlyingProduct'));
const OptimizedImage = React.lazy(() => import('../common/OptimizedImage'));
const SimpleImage = React.lazy(() => import('../common/SimpleImage'));

interface ProductCatalogProps {
  cartRef: React.RefObject<HTMLButtonElement | null>;
}

// Компонент карточки товара с мемоизацией
// const ProductCard = React.memo<{
//   product: Product;
//   lang: string;
//   getCategoryEmoji: (category: ProductCategory) => string;
//   onAddToCart: (product: Product, cardElement: HTMLElement, quantity?: number) => void;
//   t: (key: string) => string;
//   isPriority?: boolean; // Новый проп для приоритетной загрузки
//   onCardClick?: (product: Product) => void;
// }>(({ product, lang, getCategoryEmoji, onAddToCart, t, isPriority = false, onCardClick }) => {
//   const p = product as any;
//   const name =
//     (typeof p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
//     p.nameEn || p.nameRu || p.nameHe || '';
//   const description =
//     (typeof p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] === 'string' && p[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) ||
//     p.descriptionEn || p.descriptionRu || p.descriptionHe || '';

//   const handleAddToCart = useCallback((e: React.MouseEvent) => {
//     const cardElement = e.currentTarget.closest('.MuiCard-root') as HTMLElement;
//     if (cardElement) {
//       onAddToCart(product, cardElement);
//     }
//   }, [product, onAddToCart]);

//   const handleCardClick = (e: React.MouseEvent) => {
//     // Не реагировать на клик по кнопке "Добавить в корзину"
//     if ((e.target as HTMLElement).closest('button')) return;
//     if (onCardClick) onCardClick(product);
//   };

//   return (
//     <Grid item xs={12} sm={6} md={4} lg={3}>
//       <Card 
//         sx={{ 
//           height: '100%', 
//           display: 'flex', 
//           flexDirection: 'column',
//           transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
//           },
//           // Фиксированные размеры для предотвращения CLS
//           minHeight: '400px',
//           maxHeight: '400px',
//           cursor: 'pointer',
//         }}
//         onClick={handleCardClick}
//       >
//         <Box sx={{ 
//           height: '200px', 
//           minHeight: '200px', 
//           maxHeight: '200px',
//           overflow: 'hidden'
//         }}>
//           <Suspense fallback={<CircularProgress size={20} />}>
//             <SimpleImage
//               src={p.image}
//               alt={name}
//               height={200}
//               objectFit="cover"
//               borderRadius={0}
//               priority={isPriority} // Приоритетная загрузка для первых элементов
//             />
//           </Suspense>
//         </Box>
        
//         <CardContent sx={{ 
//           flexGrow: 1,
//           // Фиксированные размеры для предотвращения CLS
//           minHeight: '150px',
//           maxHeight: '150px',
//           overflow: 'hidden'
//         }}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             {getCategoryEmoji(p.category)} {name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             {description}
//           </Typography>
          
//           <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
//             {p.organic && (
//               <Chip icon={<Spa />} label="Organic" size="small" color="success" />
//             )}
//             <Chip icon={<Store />} label={p.farmName} size="small" variant="outlined" />
//           </Box>
          
//           <Typography variant="h6" color="primary" gutterBottom>
//             ₪{p.price} / {p.unit}
//           </Typography>
          
//           <Typography variant="body2" color="text.secondary">
//             📍 {p.location}
//           </Typography>
//         </CardContent>
        
//         <Box sx={{ 
//           p: 2, 
//           pt: 0,
//           // Фиксированные размеры для предотвращения CLS
//           minHeight: '60px',
//           maxHeight: '60px'
//         }}>
//           <Button
//             fullWidth
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddToCart}
//             disabled={!product.inStock}
//             sx={{ 
//               backgroundColor: '#4CAF50',
//               transition: 'all 0.2s ease-in-out',
//               '&:hover': {
//                 backgroundColor: '#45a049',
//                 transform: 'scale(1.02)',
//               }
//             }}
//           >
//             {product.inStock ? t('add_to_cart') : 'אזל במלאי Out of Stock'}
//           </Button>
//         </Box>
//       </Card>
//     </Grid>
//   );
// });
// ProductCard.displayName = 'ProductCard';

const ProductCatalog: React.FC<ProductCatalogProps> = ({ cartRef }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchTerm = useAppSelector(selectSearchTerm);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const { t } = useTranslation();
  
  console.log('🔄 ProductCatalog: Rendering, products:', filteredProducts.length);
  
  // Хук для анимации перелёта
  const {
    isFlying,
    flyingPosition,
    productImage,
    triggerAnimation,
    resetAnimation,
  } = useFlyingAnimation();

  // Состояние для модального окна увеличенной карточки
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    console.log('🔄 ProductCatalog: Fetching products');
    dispatch(fetchProducts());
  }, [dispatch]);

  // Мемоизируем обработчик добавления в корзину
  const handleAddToCart = useCallback((product: Product, cardElement: HTMLElement) => {
    
    if (!cartRef.current) {
      console.error('❌ Ссылка на корзину не найдена!');
      return;
    }

    // Добавляем товар в корзину
    dispatch(addToCart({ product, quantity: 1 }));
    
    // Запускаем анимацию
    triggerAnimation(product.image, cardElement, cartRef.current);
  }, [dispatch, triggerAnimation, cartRef]);

  // Обработчик открытия модального окна
  const handleCardClick = (product: Product) => {
    setModalProduct(product);
    setModalQuantity(1);
  };
  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setModalProduct(null);
    setModalQuantity(1);
  };
  // Обработчик изменения количества
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setModalQuantity(value);
  };
  // Обработчик добавления в корзину из модального окна
  const handleAddToCartModal = () => {
    if (modalProduct && cartRef.current) {
      dispatch(addToCart({ product: modalProduct, quantity: modalQuantity }));
      handleCloseModal();
    }
  };

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

  const nameKey = `name${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}` as keyof Product;
  const descriptionKey = `description${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}` as keyof Product;

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
        
        {/* 🏷️ Кнопки категорий вместо выпадающего списка */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          mt: 2
        }}>
          {/* Кнопка "Все категории" */}
          <Button
            variant={selectedCategory === null ? "contained" : "outlined"}
            size="small"
            onClick={() => dispatch(setSelectedCategory(null))}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: selectedCategory === null ? '#4CAF50' : 'rgba(255,255,255,0.9)',
              color: selectedCategory === null ? 'white' : '#333',
              borderColor: selectedCategory === null ? '#4CAF50' : '#ddd',
              '&:hover': {
                backgroundColor: selectedCategory === null ? '#45a049' : 'rgba(255,255,255,1)',
                borderColor: selectedCategory === null ? '#45a049' : '#4CAF50',
              },
              boxShadow: selectedCategory === null ? '0 2px 8px rgba(76,175,80,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            🌾 {t('all_categories')}
          </Button>
          
          {/* Кнопки категорий */}
          {Object.values(ProductCategory).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              size="small"
              onClick={() => dispatch(setSelectedCategory(category))}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: selectedCategory === category ? '#4CAF50' : 'rgba(255,255,255,0.9)',
                color: selectedCategory === category ? 'white' : '#333',
                borderColor: selectedCategory === category ? '#4CAF50' : '#ddd',
                '&:hover': {
                  backgroundColor: selectedCategory === category ? '#45a049' : 'rgba(255,255,255,1)',
                  borderColor: selectedCategory === category ? '#45a049' : '#4CAF50',
                },
                boxShadow: selectedCategory === category ? '0 2px 8px rgba(76,175,80,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {getCategoryEmoji(category)} {t(category)}
            </Button>
          ))}
        </Box>
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.id}>
              <ProductCard
                product={product}
                lang={lang}
                getCategoryEmoji={getCategoryEmoji}
                onAddToCart={handleAddToCart}
                t={t}
                isPriority={index < 4}
                onCardClick={handleCardClick}
              />
            </Grid>
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

      {/* Модальное окно увеличенной карточки товара */}
      <Dialog
        open={!!modalProduct}
        onClose={handleCloseModal}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: '#f7f7f7', // светло-серый фон
            boxShadow: 8,
            width: { xs: '99vw', sm: 680 },
            maxWidth: 680,
            minHeight: 520,
            maxHeight: '90vh',
            p: { xs: 1, sm: 4 },
          },
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.6)' },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {modalProduct && (
            <Box sx={{ width: '100%' }}>
              {/* Название */}
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#2C2521', 
                  fontSize: 18, 
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif', 
                  mb: 1 
                }}
              >
                {modalProduct[nameKey] || modalProduct.nameEn || modalProduct.nameRu || ''}
              </Typography>
              {/* Контент: картинка + инфо */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  px: { xs: 1, sm: 3 },
                  pb: 3,
                }}
              >
                {/* Картинка */}
                <Box sx={{ flex: '0 0 260px', mb: { xs: 2, sm: 0 } }}>
                  <Box
                    sx={{
                      width: 260,
                      height: 220,
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 2,
                      position: 'relative',
                    }}
                  >
                    <img
                      src={modalProduct.image}
                      alt={modalProduct.nameRu || modalProduct.nameEn || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 16,
                      }}
                    />
                    {modalProduct.organic && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          bgcolor: 'success.main',
                          color: '#fff',
                          px: 1.2,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontSize: 14,
                          fontWeight: 700,
                          fontFamily: 'Inter, Arial, sans-serif',
                        }}
                      >
                        Organic
                      </Box>
                    )}
                  </Box>
                </Box>
                {/* Информация */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Фермер, регион, рейтинг */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircle sx={{ color: '#888', fontSize: 22, mr: 0.5 }} />
                      <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#222' }}>
                        {modalProduct.farmName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: '#888', fontSize: 20, mr: 0.5 }} />
                      <Typography sx={{ color: '#888', fontSize: 15 }}>
                        {modalProduct.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Star sx={{ color: '#FFD600', fontSize: 20, mr: 0.5 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#222' }}>
                        {modalProduct.rating || 4.9}
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: 15, ml: 0.5 }}>
                        ({modalProduct.reviews || 24} {t('reviews')})
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  {/* Описание */}
                  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5, color: '#222', fontFamily: 'Inter, Arial, sans-serif' }}>{t('description')}</Typography>
                  <Typography variant="body2" color="#444" mb={2} sx={{ fontSize: 15, fontFamily: 'Inter, Arial, sans-serif' }}>
                    {modalProduct[descriptionKey] || modalProduct.descriptionEn || modalProduct.descriptionRu || ''}
                  </Typography>
                  {/* Цена */}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 32,
                      color: '#3cb46e',
                      mb: 1,
                      fontFamily: 'Inter, Arial, sans-serif',
                    }}
                  >
                    {modalProduct.price ? `₪${modalProduct.price}` : ''}{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        color: '#888',
                        fontSize: 20,
                        ml: 1,
                        fontFamily: 'Inter, Arial, sans-serif',
                      }}
                    >
                      {t('per_unit', { unit: modalProduct.unit })}
                    </Typography>
                  </Typography>
                  {/* Quantity */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 17, mr: 1, color: '#222', fontFamily: 'Inter, Arial, sans-serif' }}>{t('quantity')}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 36, px: 0, fontWeight: 700, fontSize: 20, borderRadius: 2, borderColor: '#bbb', color: '#222' }}
                      onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    >
                      –
                    </Button>
                    <TextField
                      value={modalQuantity}
                      size="small"
                      sx={{ width: 48, mx: 1, '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700, fontSize: 18, fontFamily: 'Inter, Arial, sans-serif' } }}
                      inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 36, px: 0, fontWeight: 700, fontSize: 20, borderRadius: 2, borderColor: '#bbb', color: '#222' }}
                      onClick={() => setModalQuantity(q => q + 1)}
                    >
                      +
                    </Button>
                  </Box>
                  {/* Итоговая цена */}
                  <Typography sx={{ color: '#888', mb: 2, fontSize: 16, fontFamily: 'Inter, Arial, sans-serif' }}>
                    {t('total')}: <b style={{ color: '#3cb46e', fontWeight: 700 }}>₪{(modalProduct.price * modalQuantity).toFixed(2)}</b>
                  </Typography>
                  {/* Кнопки */}
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{
                      mb: 1,
                      py: 1.2,
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: 2.5,
                      background: 'linear-gradient(90deg, #6fdc8c 0%, #3cb46e 100%)',
                      boxShadow: '0 2px 8px rgba(60,180,110,0.10)',
                      textTransform: 'none',
                      letterSpacing: 0.2,
                      fontFamily: 'Inter, Arial, sans-serif',
                    }}
                    startIcon={<span style={{ display: 'flex', alignItems: 'center', fontSize: 22, marginRight: 4 }}>🛒</span>}
                    onClick={() => handleAddToCartModal()}
                  >
                    {t('add_to_cart', { count: modalQuantity })}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontWeight: 600,
                      fontSize: 18,
                      borderRadius: 2.5,
                      borderColor: '#ddd',
                      color: '#222',
                      background: '#fff',
                      textTransform: 'none',
                      fontFamily: 'Inter, Arial, sans-serif',
                    }}
                  >
                    {t('contact_farmer')}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductCatalog; 
import React, { useCallback, Suspense } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box, CircularProgress } from '@mui/material';
import { Add, Spa, Store } from '@mui/icons-material';
import { Product, ProductCategory } from '../../types';

interface ProductCardProps {
  product: Product;
  lang: string;
  getCategoryEmoji: (category: ProductCategory) => string;
  onAddToCart: (product: Product, cardElement: HTMLElement, quantity?: number) => void;
  t: (key: string, options?: any) => string;
  isPriority?: boolean;
  onCardClick?: (product: Product) => void;
}

const SimpleImage = React.lazy(() => import('./SimpleImage'));

const ProductCard: React.FC<ProductCardProps> = ({ product, lang, getCategoryEmoji, onAddToCart, t, isPriority = false, onCardClick }) => {
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Не реагировать на клик по кнопке "Добавить в корзину"
    if ((e.target as HTMLElement).closest('button')) return;
    if (onCardClick) onCardClick(product);
  };

  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: '0.3s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.15)',
            zIndex: 2,
          },
          minHeight: '400px',
          maxHeight: '400px',
          cursor: 'pointer',
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ 
          height: '200px', 
          minHeight: '200px', 
          maxHeight: '200px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            src={p.image}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
              transition: 'transform 0.5s cubic-bezier(.4,1,.6,1)',
            }}
          />
          <Suspense fallback={<CircularProgress size={20} />}>
            <SimpleImage
              src={p.image}
              alt={name}
              height={200}
              objectFit="cover"
              borderRadius={0}
              priority={isPriority}
            />
          </Suspense>
        </Box>
        <CardContent sx={{ 
          flexGrow: 1,
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
              <Chip icon={<Spa />} label={t('organic')} size="small" color="success" />
            )}
            <Chip icon={<Store />} label={p.farmName} size="small" variant="outlined" />
          </Box>
          <Typography variant="h6" color="primary" gutterBottom>
            ₪{p.price} {t('per_unit', { unit: p.unit })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {p.location}
          </Typography>
        </CardContent>
        <Box sx={{ 
          p: 2, 
          pt: 0,
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
            {product.inStock ? t('add_to_cart') : 'Out of Stock'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductCard; 
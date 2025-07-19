import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Card,
  CardMedia,
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
} from '@mui/material';

import { Search, Add, Spa, Store } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProducts, setSearchTerm, setSelectedCategory } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Product, ProductCategory } from '../../types';
import { useTranslation } from 'react-i18next';

const ProductCatalog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, selectedCategory, searchTerm } = useAppSelector(state => state.products);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = items.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameHe.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const getCategoryEmoji = (category: ProductCategory) => {
    const emojis = {
      [ProductCategory.VEGETABLES]: '🥬',
      [ProductCategory.FRUITS]: '🍎',
      [ProductCategory.HERBS]: '🌿',
      [ProductCategory.DAIRY]: '🥛',
      [ProductCategory.HONEY]: '🍯',
      [ProductCategory.FLOWERS]: '🌸',
    };
    return emojis[category] || '🌾';
  };

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
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('category')}</InputLabel>
          <Select
            value={selectedCategory || ''}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value as ProductCategory || null))}
          >
            <MenuItem value="">🌾 {t('all_categories')}</MenuItem>
            {Object.values(ProductCategory).map(category => (
              <MenuItem key={category} value={category}>
                {getCategoryEmoji(category)} {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 📦 Каталог продуктов */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {getCategoryEmoji(product.category)} {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.nameHe}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {product.organic && (
                    <Chip icon={<Spa />} label="Organic" size="small" color="success" />
                  )}
                  <Chip icon={<Store />} label={product.farmName} size="small" variant="outlined" />
                </Box>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  ₪{product.price} / {product.unit}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  📍 {product.location}
                </Typography>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  sx={{ backgroundColor: '#4CAF50' }}
                >
                  {product.inStock ? t('add_to_cart') : 'אזל במלאי Out of Stock'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductCatalog; 
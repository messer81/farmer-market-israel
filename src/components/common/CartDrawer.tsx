import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleCart, updateQuantity, removeFromCart, setShowCheckout, setAuthOpen } from '../../store/slices/cartSlice';
import CheckoutPage from '../pages/CheckoutPage';
import { useTranslation } from 'react-i18next';
import AuthFrame from '../pages/AuthFrame';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, isOpen } = useAppSelector(state => state.cart);
  // Получаем флаги showCheckout и authOpen из Redux, чтобы они не сбрасывались при перерисовке
  const showCheckout = useAppSelector(state => state.cart.showCheckout);
  const authOpen = useAppSelector(state => state.cart.authOpen);
  const user = useAppSelector(state => state.user.user);

  const { t } = useTranslation();

  const handleClose = () => {
    dispatch(toggleCart());
    setShowCheckout(false);
  };

  // Открыть оформление заказа или авторизацию
  const handleCheckout = () => {
    if (!user) {
      dispatch(setAuthOpen(true)); // Открыть окно авторизации, если не залогинен
    } else {
      dispatch(setShowCheckout(true)); // Открыть оформление заказа
    }
  };

  // Закрыть оформление заказа и авторизацию
  const handleCloseCheckout = () => {
    dispatch(setShowCheckout(false));
    dispatch(setAuthOpen(false));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <AuthFrame
        open={authOpen}
        onClose={() => dispatch(setAuthOpen(false))}
        onSuccess={() => {
          dispatch(setAuthOpen(false));
          dispatch(setShowCheckout(true)); // После логина сразу открываем оформление заказа
        }}
      />
      <Box sx={{ width: showCheckout ? '100%' : 400, height: '100%' }}>
        {showCheckout ? (
          <CheckoutPage />
        ) : (
          <Box sx={{ p: 2 }}>
            {/* 🛒 Заголовок */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">🛒 {t('cart')}</Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 📦 Товары в корзине */}
            {items.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                🛒 {t('cart_empty')}
              </Typography>
            ) : (
              <>
                <List>
                  {items.map((item) => {
                    // Обрабатываем как старую, так и новую структуру
                    const product = item.product || item;
                    const quantity = item.quantity;
                    
                    return (
                      <ListItem key={product.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar src={product.image} alt={product.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.name}
                          secondary={`₪${product.price} / ${product.unit}`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product.id, quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            sx={{ width: 60 }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product.id, quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => dispatch(removeFromCart(product.id))}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* 💰 Итого */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{t('total')}:</Typography>
                  <Typography variant="h6" color="primary">₪{total.toFixed(2)}</Typography>
                </Box>

                {/* 🚚 Кнопка заказа */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  sx={{ backgroundColor: '#4CAF50' }}
                >
                  📦 {t('proceed_to_checkout')}
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 
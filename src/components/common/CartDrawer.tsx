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
import { toggleCart, updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import CheckoutPage from '../pages/CheckoutPage';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, isOpen } = useAppSelector(state => state.cart);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleClose = () => {
    dispatch(toggleCart());
    setShowCheckout(false);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
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
      <Box sx={{ width: showCheckout ? '100%' : 400, height: '100%' }}>
        {showCheckout ? (
          <CheckoutPage />
        ) : (
          <Box sx={{ p: 2 }}>
            {/* 🛒 Заголовок */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">🛒 עגלת קניות Cart</Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 📦 Товары в корзине */}
            {items.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                🛒 העגלה ריקה<br />Your cart is empty
              </Typography>
            ) : (
              <>
                <List>
                  {items.map((item) => (
                    <ListItem key={item.product.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={item.product.image} alt={item.product.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.product.name}
                        secondary={`₪${item.product.price} / ${item.product.unit}`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                          sx={{ width: 60 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* 💰 Итого */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">סה"כ Total:</Typography>
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
                  📦 לתשלום Proceed to Checkout
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
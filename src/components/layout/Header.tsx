import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Language,
  AccountCircle,
  Agriculture,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleCart } from '../../store/slices/cartSlice';

const Header: React.FC<{ onProfileClick?: () => void }> = ({ onProfileClick }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
      <Toolbar>
        {/* 🌾 Лого */}
        <Agriculture sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          שוק החקלאי 🇮🇱 Farmer Market
        </Typography>

        {/* 🌐 Языки */}
        <IconButton color="inherit" onClick={handleLanguageClick}>
          <Language />
        </IconButton>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={handleLanguageClose}
        >
          <MenuItem onClick={handleLanguageClose}>🇮🇱 עברית</MenuItem>
          <MenuItem onClick={handleLanguageClose}>🇺🇸 English</MenuItem>
          <MenuItem onClick={handleLanguageClose}>🇷🇺 Русский</MenuItem>
        </Menu>

        {/* 🛒 Корзина */}
        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* 👤 Профиль */}
        <IconButton color="inherit" onClick={onProfileClick}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
import React, { useState } from 'react';
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
 
  AccountCircle,
  Agriculture,
  Language,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleCart } from '../../store/slices/cartSlice';
import { clearUser } from '../../store/slices/userSlice';
import { setLanguage, type Language as LanguageType } from '../../store/slices/languageSlice';

const Header: React.FC<{ onProfileClick?: () => void }> = ({ onProfileClick }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const user = useAppSelector(state => state.user.user);
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchor(null);
  };

  const handleLanguageSelect = (language: LanguageType) => {
    dispatch(setLanguage(language));
    localStorage.setItem('language', language);
    setLangAnchor(null);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (user) {
      setProfileAnchor(event.currentTarget);
    } else if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    setProfileAnchor(null);
    localStorage.removeItem('jwt');
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
          <MenuItem 
            onClick={() => handleLanguageSelect('he')}
            selected={currentLanguage === 'he'}
          >
            🇮🇱 עברית
          </MenuItem>
          <MenuItem 
            onClick={() => handleLanguageSelect('en')}
            selected={currentLanguage === 'en'}
          >
            🇺🇸 English
          </MenuItem>
          <MenuItem 
            onClick={() => handleLanguageSelect('ru')}
            selected={currentLanguage === 'ru'}
          >
            🇷🇺 Русский
          </MenuItem>
        </Menu>

        {/* 🛒 Корзина */}
        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* 👤 Профиль */}
        <IconButton color="inherit" onClick={handleProfileMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
        >
          {user && (
            <>
              <MenuItem disabled>
                {user.name ? user.name : user.email}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
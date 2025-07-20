import React, { useState, forwardRef } from 'react';
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
  AccountCircle,
  Agriculture,
  Language,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleCart } from '../../store/slices/cartSlice';
import { clearUser } from '../../store/slices/userSlice';
import { setLanguage, type Language as LanguageType } from '../../store/slices/languageSlice';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useNavigate } from 'react-router-dom';
import AnimatedCartIcon from '../common/AnimatedCartIcon';

interface HeaderProps {
  onProfileClick?: () => void;
  showOnWelcome?: boolean;
  cartRef?: React.RefObject<HTMLButtonElement | null>;
}

const Header: React.FC<HeaderProps> = ({ 
  onProfileClick, 
  showOnWelcome = true,
  cartRef 
}) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const user = useAppSelector(state => state.user.user);
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  // Синхронизация языка с i18n
  React.useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage && i18n.isInitialized) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

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
    if (i18n.isInitialized) {
      i18n.changeLanguage(language);
    }
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
    <AppBar position="fixed" sx={{ backgroundColor: '#4CAF50', zIndex: 1000 }}>
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

        {/* 🛒 Анимированная корзина */}
        <AnimatedCartIcon
          itemCount={cartItems.length}
          onClick={handleCartClick}
          ref={cartRef}
        />

        {/* 🛠️ Админка */}
        <IconButton 
          color="inherit" 
          onClick={() => window.open('/admin', '_blank')}
          title="Панель администратора"
        >
          <AdminPanelSettings />
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
          {user ? [
            <MenuItem key="name" disabled>
              {user.name ? user.name : user.email}
            </MenuItem>,
            <MenuItem key="orders" onClick={() => { handleProfileClose(); navigate('/orders'); }}>
              История заказов
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              {t('logout')}
            </MenuItem>
          ] : null}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
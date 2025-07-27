import React from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Language, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../assets/images/Farm Sharing background.jpg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setLanguage, type Language as LanguageType } from '../../store/slices/languageSlice';
import i18n from '../../i18n';

interface WelcomeScreenProps {
  onBuyerClick: () => void;
  onSellerClick: () => void;
  onBack?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBuyerClick, onSellerClick, onBack }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage && i18n.isInitialized) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

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

  return (
    <div
      style={{
        // backgroundImage: `url(${backgroundImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // backgroundAttachment: 'fixed',
        backgroundColor: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Кнопка "Назад" */}
      {onBack && (
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 3 }}>
          <IconButton onClick={onBack} sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.2)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.3)' } }}>
            <ArrowBack />
          </IconButton>
        </Box>
      )}
      {/* Кнопка выбора языка */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
        <IconButton
          onClick={handleLanguageClick}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          <Language />
        </IconButton>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={handleLanguageClose}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2
            }
          }}
        >
          <MenuItem onClick={() => handleLanguageSelect('he')} selected={currentLanguage === 'he'}>🇮🇱 עברית</MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('en')} selected={currentLanguage === 'en'}>🇺🇸 English</MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('ru')} selected={currentLanguage === 'ru'}>🇷🇺 Русский</MenuItem>
        </Menu>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            mb: 6,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}
        >
          {t('welcomeScreen.title')}
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ width: 320, py: 2, fontSize: 22, borderRadius: 3, boxShadow: 3 }}
            onClick={onBuyerClick}
          >
            {t('welcomeScreen.buyer')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ width: 320, py: 2, fontSize: 22, borderRadius: 3, boxShadow: 3, backgroundColor: 'rgba(255,255,255,0.8)' }}
            onClick={onSellerClick}
          >
            {t('welcomeScreen.seller')}
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default WelcomeScreen; 
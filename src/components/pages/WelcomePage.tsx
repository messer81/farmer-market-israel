import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Fade,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Agriculture, ShoppingCart, LocalShipping, Language, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../assets/images/Farm Sharing background.jpg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setLanguage, type Language as LanguageType } from '../../store/slices/languageSlice';
import i18n from '../../i18n';

interface WelcomePageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onBack?: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLoginClick, onRegisterClick, onBack }) => {
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
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
      {/* Оверлей для лучшей читаемости */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0
        }}
      />
      {/* Кнопка выбора языка */}
      <Box sx={{ 
        position: 'absolute', 
        top: 20, 
        right: 20, 
        zIndex: 2 
      }}>
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
      </Box>
      {/* Контент */}
      <Container 
        maxWidth="md" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          py: 4
        }}
      >
        <Fade in timeout={1000}>
          <Paper 
            elevation={8}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              maxWidth: 600
            }}
          >
            {/* Логотип */}
            <Agriculture 
              sx={{ 
                fontSize: 80, 
                color: '#4CAF50', 
                mb: 2 
              }} 
            />
            {/* Заголовок */}
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: '#2E7D32',
                mb: 2
              }}
            >
              🌾 {t('welcome.title')}
            </Typography>
            {/* Подзаголовок */}
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom
              sx={{ mb: 4 }}
            >
              {t('welcome.subtitle')}
            </Typography>
            {/* Описание */}
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              {t('welcome.description')}
            </Typography>
            {/* Преимущества */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Agriculture sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('welcome.features.fresh')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <ShoppingCart sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('welcome.features.shopping')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <LocalShipping sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('welcome.features.delivery')}
                </Typography>
              </Box>
            </Box>
            {/* Кнопки действий */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={onLoginClick}
                sx={{ 
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#2E7D32' },
                  px: 4,
                  py: 1.5
                }}
              >
                {t('welcome.login')}
              </Button>
              <Button
                variant="outlined"
                onClick={onRegisterClick}
                sx={{ 
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': { 
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                {t('welcome.register')}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default WelcomePage; 
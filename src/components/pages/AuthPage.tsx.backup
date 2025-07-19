import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { Agriculture, ArrowBack } from '@mui/icons-material';
import GoogleLogo from '../common/GoogleLogo';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../assets/images/Farm Sharing background.jpg';
import AuthFrame from './AuthFrame';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAppDispatch } from '../../hooks/redux';
import { setUser, setToken } from '../../store/slices/userSlice';
import { useLocation } from 'react-router-dom';

interface AuthPageProps {
  onBackClick: () => void;
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBackClick, onAuthSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // Читаем query-параметр tab
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') === 'register' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authOpen, setAuthOpen] = useState(params.get('tab') === 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    onAuthSuccess();
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Проверяем, есть ли уже профиль пользователя
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Создаем новый профиль
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Пользователь',
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date()
        });
      }
      
      dispatch(setUser({
        id: user.uid,
        name: user.displayName || 'Пользователь',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '',
        preferredLanguage: 'ru' as const
      }));
      
      const token = await user.getIdToken();
      dispatch(setToken(token));
      localStorage.setItem('jwt', token);
      onAuthSuccess();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Ошибка авторизации через Google');
    } finally {
      setLoading(false);
    }
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
      {/* Оверлей */}
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

      {/* Хедер */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBackClick}
          sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          Назад / Back
        </Button>
      </Box>

      {/* Контент */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          py: 4
        }}
      >
        <Fade in timeout={800}>
          <Paper 
            elevation={8}
            sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            {/* Логотип */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Agriculture 
                sx={{ 
                  fontSize: 60, 
                  color: '#4CAF50', 
                  mb: 1 
                }} 
              />
              <Typography variant="h4" color="#2E7D32" gutterBottom>
                🌾 Farm Market Israel
              </Typography>
            </Box>

            {/* Табы */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTab-root': {
                    color: '#666',
                    '&.Mui-selected': {
                      color: '#4CAF50'
                    }
                  }
                }}
              >
                <Tab label="Войти / Login" />
                <Tab label="Регистрация / Register" />
              </Tabs>
            </Box>

            {/* Контент табов */}
            <Box sx={{ mt: 3 }}>
              {activeTab === 0 ? (
                // Логин
                <Box>
                  <Typography variant="h6" gutterBottom align="center">
                    Добро пожаловать обратно!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Войдите в свой аккаунт для доступа к каталогу
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setAuthOpen(true)}
                    sx={{ 
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#2E7D32' },
                      py: 1.5
                    }}
                  >
                    Войти / Login
                  </Button>
                </Box>
              ) : (
                // Регистрация
                <Box>
                  <Typography variant="h6" gutterBottom align="center">
                    Создайте новый аккаунт
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Зарегистрируйтесь для доступа к свежим продуктам
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setAuthOpen(true)}
                    sx={{ 
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#2E7D32' },
                      py: 1.5
                    }}
                  >
                    Регистрация / Register
                  </Button>
                </Box>
              )}
            </Box>

            {/* Google кнопка */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleLogo />}
                onClick={handleGoogleAuth}
                disabled={loading}
                sx={{
                  borderColor: '#4285F4',
                  color: '#4285F4',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(66, 133, 244, 0.1)',
                  '&:hover': {
                    borderColor: '#3367D6',
                    backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    boxShadow: '0 4px 8px rgba(66, 133, 244, 0.2)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    borderColor: '#ccc',
                    color: '#999',
                    backgroundColor: '#f5f5f5'
                  },
                  py: 1.5,
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {loading ? 'Загрузка...' : t('google_auth')}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Информация */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                💡 {t('google_auth_info')}
              </Typography>
            </Box>

            {/* Информация */}
            <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                💡 После авторизации вы получите доступ к полному каталогу товаров
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {/* Диалог авторизации */}
      <AuthFrame 
        open={authOpen} 
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialTab={activeTab}
      />
    </div>
  );
};

export default AuthPage; 
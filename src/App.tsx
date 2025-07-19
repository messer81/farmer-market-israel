import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { setToken } from './store/slices/userSlice';
import Header from './components/layout/Header';
import ProductCatalog from './components/pages/ProductCatalog';
import CartDrawer from './components/common/CartDrawer';
import AdminPage from './components/pages/AdminPage';
import WelcomePage from './components/pages/WelcomePage';
import AuthPage from './components/pages/AuthPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import backgroundImage from './assets/images/Farm Sharing background.jpg';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF9800',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
      'Arial Hebrew',
      'David',
    ].join(','),
  },
  direction: 'ltr',
});

const AppContent: React.FC = () => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<'welcome' | 'auth' | 'catalog'>('welcome');

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  React.useEffect(() => {
    // Если пользователь авторизован, показываем каталог
    if (user) {
      setCurrentPage('catalog');
    }
  }, [user]);

  const handleProfileClick = () => {
    if (!user) setCurrentPage('auth');
  };

  const handleLoginClick = () => {
    setCurrentPage('auth');
  };

  const handleRegisterClick = () => {
    setCurrentPage('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('catalog');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  // Простой роутинг для админки
  const isAdminPage = window.location.pathname === '/admin';

  if (isAdminPage) {
    return <AdminPage />;
  }

  // Рендерим страницы в зависимости от состояния
  if (currentPage === 'welcome') {
    return (
      <WelcomePage 
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
    );
  }

  if (currentPage === 'auth') {
    return (
      <AuthPage 
        onBackClick={handleBackToWelcome}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // Каталог (после авторизации)
  return (
    <div 
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div className="content-wrapper">
        <Header onProfileClick={handleProfileClick} showOnWelcome={false} />
        <ProductCatalog />
        <CartDrawer />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  </Provider>
);

export default App; 
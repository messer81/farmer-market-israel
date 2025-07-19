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
import WelcomeScreen from './components/pages/WelcomeScreen';
import SellerStubPage from './components/pages/SellerStubPage';
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
  const [currentPage, setCurrentPage] = useState<'welcomeScreen' | 'welcome' | 'auth' | 'catalog' | 'sellerStub'>('welcomeScreen');

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  React.useEffect(() => {
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

  // Новый обработчик возврата на WelcomeScreen
  const handleBackToWelcomeScreen = () => {
    setCurrentPage('welcomeScreen');
  };

  // Простой роутинг для админки
  const isAdminPage = window.location.pathname === '/admin';

  if (isAdminPage) {
    return <AdminPage />;
  }

  // Новый экран WelcomeScreen
  if (currentPage === 'welcomeScreen') {
    return (
      <WelcomeScreen
        onBuyerClick={() => setCurrentPage('welcome')}
        onSellerClick={() => setCurrentPage('sellerStub')}
        // onBack не передаём, чтобы не было кнопки назад на самом первом экране
      />
    );
  }

  // Заглушка для продавца
  if (currentPage === 'sellerStub') {
    return <SellerStubPage onBack={() => setCurrentPage('welcomeScreen')} />;
  }

  // Рендерим страницы в зависимости от состояния
  if (currentPage === 'welcome') {
    return (
      <WelcomePage
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onBack={() => setCurrentPage('welcomeScreen')}
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
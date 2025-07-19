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
import WelcomeScreen from './components/pages/WelcomeScreen';
import SellerStubPage from './components/pages/SellerStubPage';
import OrderHistory from './components/pages/OrderHistory';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import backgroundImage from './assets/images/Farm Sharing background.jpg';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';

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
  // useNavigate для программных переходов
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  // Простой роутинг для админки
  if (window.location.pathname === '/admin') {
    return <AdminPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen onBuyerClick={() => navigate('/welcome')} onSellerClick={() => navigate('/seller')} />} />
      <Route path="/welcome" element={<WelcomePage onLoginClick={() => navigate('/catalog')} onRegisterClick={() => navigate('/catalog')} onBack={() => navigate('/')} />} />
      <Route path="/catalog" element={
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
            <Header onProfileClick={() => navigate('/auth')} showOnWelcome={false} />
            <ProductCatalog />
            <CartDrawer />
          </div>
        </div>
      } />
      <Route path="/seller" element={<SellerStubPage onBack={() => navigate('/')} />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import WelcomeScreen from './components/pages/WelcomeScreen';
import WelcomePage from './components/pages/WelcomePage';
import CatalogPage from './components/pages/CatalogPage';
import CheckoutPage from './components/pages/CheckoutPage';
import AdminPage from './components/pages/AdminPage';
import SellerStubPage from './components/pages/SellerStubPage';
import OrderHistory from './components/pages/OrderHistory';
import CartDrawer from './components/common/CartDrawer';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { setToken } from './store/slices/userSlice';

// Создаём тему с поддержкой иврита
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
  direction: 'ltr', // Можно изменить на 'rtl' для иврита
});

const AppContent: React.FC = () => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
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
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/seller" element={<SellerStubPage onBack={() => navigate('/')} />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 
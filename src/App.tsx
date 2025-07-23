import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { setUser, clearUser, setToken } from './store/slices/userSlice';
import Header from './components/layout/Header';
import ProductCatalog from './components/pages/ProductCatalog';
import CartDrawer from './components/common/CartDrawer';
import AdminPage from './components/pages/AdminPage';
import WelcomePage from './components/pages/WelcomePage';
import WelcomeScreen from './components/pages/WelcomeScreen';
import CatalogPage from './components/pages/CatalogPage';
import CheckoutPage from './components/pages/CheckoutPage';
import SellerStubPage from './components/pages/SellerStubPage';
import OrderHistory from './components/pages/OrderHistory';

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
    // Подписка на изменения авторизации Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Firebase auth state changed:', firebaseUser ? 'logged in' : 'logged out');
      if (firebaseUser) {
        // Пользователь залогинен
        console.log('👤 Setting user in Redux:', firebaseUser.email);
        dispatch(setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          address: '',
          preferredLanguage: 'ru',
        }));
        const token = await firebaseUser.getIdToken();
        dispatch(setToken(token));
      } else {
        // Пользователь разлогинен
        console.log('🚪 Clearing user from Redux');
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Простой роутинг для админки
  if (window.location.pathname === '/admin') {
    return <AdminPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen onBuyerClick={() => navigate('/welcome')} onSellerClick={() => navigate('/seller')} />} />
      <Route path="/welcome" element={<WelcomePage onLoginClick={() => {
        console.log('🔄 App: Navigating to /catalog');
        navigate('/catalog');
      }} onRegisterClick={() => {
        console.log('🔄 App: Navigating to /catalog');
        navigate('/catalog');
      }} onBack={() => navigate('/')} />} />
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
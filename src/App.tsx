import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { setToken } from './store/slices/userSlice';
import Dialog from '@mui/material/Dialog';
import AuthFrame from './components/pages/AuthFrame';
import Header from './components/layout/Header';
import ProductCatalog from './components/pages/ProductCatalog';
import CartDrawer from './components/common/CartDrawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

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
  const [authOpen, setAuthOpen] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  const handleProfileClick = () => {
    if (!user) setAuthOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header onProfileClick={handleProfileClick} />
      <ProductCatalog />
      <CartDrawer />
      <Dialog open={authOpen} onClose={() => setAuthOpen(false)}>
        <AuthFrame />
      </Dialog>
    </Box>
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
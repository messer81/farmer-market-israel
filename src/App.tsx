import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { store } from './store';
import Header from './components/layout/Header';
import ProductCatalog from './components/pages/ProductCatalog';
import CartDrawer from './components/common/CartDrawer';

// 🎨 Тема для MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Зеленый цвет для фермерского маркета
    },
    secondary: {
      main: '#FF9800', // Оранжевый для акцентов
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
      // Добавляем поддержку иврита
      'Arial Hebrew',
      'David',
    ].join(','),
  },
  direction: 'ltr', // Можно менять на 'rtl' для иврита
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Header />
          <ProductCatalog />
          <CartDrawer />
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 
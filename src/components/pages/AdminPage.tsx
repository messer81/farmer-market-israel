import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import OrdersExport from '../admin/OrdersExport';

const AdminPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper sx={{ m: 2, p: 3 }}>
        <Typography variant="h3" gutterBottom align="center">
          🛠️ Панель администратора
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Управление заказами и экспорт данных
        </Typography>
        
        <OrdersExport />
      </Paper>
    </Box>
  );
};

export default AdminPage; 
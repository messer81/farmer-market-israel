import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import OrdersExport from '../admin/OrdersExport';
import backgroundImage from '../../assets/images/Farm Sharing background.jpg';

const AdminPage: React.FC = () => {
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
        <Paper sx={{ m: 2, p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h3" gutterBottom align="center">
            🛠️ Панель администратора
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Управление заказами и экспорт данных
          </Typography>
          
          <OrdersExport />
        </Paper>
      </div>
    </div>
  );
};

export default AdminPage; 
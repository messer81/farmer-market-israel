import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

interface SellerStubPageProps {
  onBack: () => void;
}

const SellerStubPage: React.FC<SellerStubPageProps> = ({ onBack }) => {
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Экран продавца в разработке
        </Typography>
        <Button variant="contained" color="primary" onClick={onBack} sx={{ fontSize: 18, px: 6, py: 2 }}>
          Назад
        </Button>
      </Box>
    </Container>
  );
};

export default SellerStubPage; 
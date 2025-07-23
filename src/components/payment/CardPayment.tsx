import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CardPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({ amount, onSuccess, onError }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const validateCard = () => {
    // Простая валидация Luhn алгоритмом
    const cardNumber = cardData.number.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return t('invalid_card_number');
    }
    
    // Проверка CVC
    if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
      return t('invalid_cvc');
    }
    
    // Проверка срока действия
    const [month, year] = cardData.expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return t('expired_card');
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateCard();
    if (validationError) {
      onError(validationError);
      return;
    }
    
    setLoading(true);

    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Генерируем тестовый ID платежа
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onSuccess(paymentId);
    } catch (error) {
      onError(t('payment_processing_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Форматирование номера карты
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Форматирование срока действия
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    
    // Только цифры для CVC
    if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        💳 {t('credit_card_payment')}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('test_card_info')}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('card_number')}
            value={cardData.number}
            onChange={(e) => handleCardChange('number', e.target.value)}
            placeholder="1234 5678 9012 3456"
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={t('expiry_date')}
            value={cardData.expiry}
            onChange={(e) => handleCardChange('expiry', e.target.value)}
            placeholder="MM/YY"
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={t('cvc')}
            value={cardData.cvc}
            onChange={(e) => handleCardChange('cvc', e.target.value)}
            placeholder="123"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('cardholder_name')}
            value={cardData.name}
            onChange={(e) => handleCardChange('name', e.target.value)}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('total_amount')}: ₪{amount.toFixed(2)}
        </Typography>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: '#4CAF50', mt: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              {t('processing_payment')}
            </>
          ) : (
            `💳 ${t('pay')} ₪${amount.toFixed(2)}`
          )}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>{t('test_mode')}:</strong><br />
          {t('test_card_number')}: 4242 4242 4242 4242<br />
          {t('test_expiry')}: 12/25<br />
          {t('test_cvc')}: 123
        </Typography>
      </Alert>
    </Box>
  );
};

export default CardPayment; 
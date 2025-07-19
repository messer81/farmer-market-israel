import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Box, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, onSuccess, onError }) => {
  const { t } = useTranslation();

  const paypalOptions = {
    'client-id': 'test', // Тестовый клиент ID
    currency: 'ILS',
    intent: 'capture'
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📱 PayPal
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>{t('test_mode')}:</strong><br />
          {t('paypal_test_info')}
        </Typography>
      </Alert>

      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: 'ILS'
                  },
                  description: 'Farmer Market Israel - Order'
                }
              ]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details.id);
            });
          }}
          onError={(err) => {
            onError('PayPal payment failed');
          }}
        />
      </PayPalScriptProvider>
    </Box>
  );
};

export default PayPalPayment; 
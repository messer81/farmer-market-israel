import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearCart, toggleCart } from '../../store/slices/cartSlice';
import { useTranslation } from 'react-i18next';
import { DeliveryAddress, PaymentMethod, OrderStatus } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import CardPayment from '../payment/CardPayment';
import PayPalPayment from '../payment/PayPalPayment';
import WelcomePage from './WelcomePage';

const steps = ['cart', 'delivery', 'payment', 'confirmation'];

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const user = useAppSelector(state => state.user.user);
  const [showAuth, setShowAuth] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Форма доставки
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: user?.name || t('guest'),
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  
  // Способ оплаты
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [paymentId, setPaymentId] = useState<string>('');
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeliveryChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSubmitOrder = async () => {
    setLoading(true);
    setError('');

    // Проверка обязательных полей
    if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.name || !deliveryAddress.phone) {
      setError(t('fill_delivery_fields'));
      setLoading(false);
      return;
    }
    if (!items || items.length === 0) {
      setError(t('cart_empty_error'));
      setLoading(false);
      return;
    }
    if (!total || total <= 0) {
      setError(t('invalid_total_error'));
      setLoading(false);
      return;
    }

          try {
        // Функция для рекурсивной очистки undefined значений
      const cleanUndefinedValues = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanUndefinedValues);
        } else if (obj && typeof obj === 'object') {
          // Проверяем, не является ли это Date объектом
          if (obj instanceof Date) {
            return obj; // Возвращаем Date как есть
          }
          const cleaned: any = {};
          Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined) {
              cleaned[key] = null;
            } else if (typeof value === 'object' && !(value instanceof Date)) {
              cleaned[key] = cleanUndefinedValues(value);
            } else {
              cleaned[key] = value;
            }
          });
          return cleaned;
        }
        return obj;
      };

      // Очищаем deliveryAddress от undefined
      const cleanDeliveryAddress = Object.fromEntries(
        Object.entries(deliveryAddress).map(([k, v]) => [k, v === undefined ? '' : v])
      );
      
                     // Теперь структура корзины уже соответствует структуре заказа
        const cleanedItems = items.map((cartItem: any) => {
          // Проверяем, какая структура у cartItem
          if (cartItem.product) {
            // Новая структура: { product: Product, quantity: number }
            return cartItem;
          } else {
            // Старая структура: CartItem extends Product
           const orderItem = {
             product: {
               id: cartItem.id,
               name: cartItem.name,
               nameEn: cartItem.nameEn,
               nameRu: cartItem.nameRu,
               nameHe: cartItem.nameHe,
               price: cartItem.price,
               currency: cartItem.currency,
               category: cartItem.category,
               description: cartItem.description,
               descriptionEn: cartItem.descriptionEn,
               descriptionRu: cartItem.descriptionRu,
               descriptionHe: cartItem.descriptionHe,
               image: cartItem.image,
               farmId: cartItem.farmId,
               farmName: cartItem.farmName,
               location: cartItem.location,
               organic: cartItem.organic,
               inStock: cartItem.inStock,
               unit: cartItem.unit,
               rating: cartItem.rating,
               reviews: cartItem.reviews
             },
             quantity: cartItem.quantity
                         };
              return orderItem;
            }
          });
      
             // Создаем простую дату для заказа
       const orderDate = new Date();
       
       const orderData = {
         userId: user?.id || 'guest',
         items: cleanedItems,
         total: total || 0,
         status: OrderStatus.PENDING,
         deliveryAddress: cleanDeliveryAddress,
         paymentMethod: paymentMethod || 'cash',
         paymentId: paymentId ? paymentId : null,
         notes: deliveryAddress.notes || '',
         createdAt: orderDate,
         updatedAt: orderDate
       };

      // Очищаем все undefined значения в orderData
      const cleanedOrderData = cleanUndefinedValues(orderData);

              // Сохраняем заказ в Firestore
        const docRef = await addDoc(collection(db, 'orders'), cleanedOrderData);
      
      // Очищаем корзину
      dispatch(clearCart());
      dispatch(toggleCart());
      // Переходим к подтверждению
      setActiveStep(3);
    } catch (error: any) {
      console.error('Ошибка создания заказа:', error);
      setError(error?.message || t('order_error'));
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              🛒 {t('cart')}
            </Typography>
            {items.map((item) => {
              // Обрабатываем как старую, так и новую структуру
              const product = item.product || item;
              const quantity = item.quantity;
              
              return (
                <Card key={product.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₪{product.price} / {product.unit}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h6">x{quantity}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">{t('total')}:</Typography>
              <Typography variant="h6" color="primary">₪{total.toFixed(2)}</Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              🚚 {t('delivery_address')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('name')}
                  value={deliveryAddress.name}
                  onChange={(e) => handleDeliveryChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('phone')}
                  value={deliveryAddress.phone}
                  onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('address')}
                  value={deliveryAddress.address}
                  onChange={(e) => handleDeliveryChange('address', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('city')}
                  value={deliveryAddress.city}
                  onChange={(e) => handleDeliveryChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('zip_code')}
                  value={deliveryAddress.zipCode}
                  onChange={(e) => handleDeliveryChange('zipCode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('notes')}
                  value={deliveryAddress.notes}
                  onChange={(e) => handleDeliveryChange('notes', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              💳 {t('payment_method')}
            </Typography>
            {paymentMethod === PaymentMethod.CARD ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mb: 2 }}
                  onClick={() => {
                    setPaymentMethod(PaymentMethod.CASH);
                    setError('');
                  }}
                >
                  {t('change_payment_method')}
                </Button>
                <CardPayment
                  amount={total}
                  onSuccess={(paymentId) => {
                    setPaymentId(paymentId);
                    handleSubmitOrder();
                  }}
                  onError={(error) => setError(error)}
                />
              </>
            ) : paymentMethod === PaymentMethod.PAYPAL ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mb: 2 }}
                  onClick={() => {
                    setPaymentMethod(PaymentMethod.CASH);
                    setError('');
                  }}
                >
                  {t('change_payment_method')}
                </Button>
                <PayPalPayment
                  amount={total}
                  onSuccess={(paymentId) => {
                    setPaymentId(paymentId);
                    handleSubmitOrder();
                  }}
                  onError={(error) => setError(error)}
                />
              </>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel>{t('payment_method')}</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <MenuItem value={PaymentMethod.CASH}>💵 {t('cash_on_delivery')}</MenuItem>
                    <MenuItem value={PaymentMethod.CARD}>💳 {t('credit_card')}</MenuItem>
                    <MenuItem value={PaymentMethod.PAYPAL}>📱 PayPal</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📋 {t('order_summary')}
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        {t('delivery_address')}: {deliveryAddress.address}, {deliveryAddress.city}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {t('payment_method')}: {paymentMethod === PaymentMethod.CASH ? t('cash_on_delivery') : 
                          paymentMethod === PaymentMethod.CARD ? t('credit_card') : 'PayPal'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="h6" color="primary">
                        {t('total')}: ₪{total.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              ✅ {t('order_confirmed')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t('order_confirmed_message')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => dispatch(toggleCart())}
              sx={{ backgroundColor: '#4CAF50' }}
            >
              {t('continue_shopping')}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  if (items.length === 0 && activeStep === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          🛒 {t('cart_empty')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(toggleCart())}
          sx={{ mt: 2, backgroundColor: '#4CAF50' }}
        >
          {t('continue_shopping')}
        </Button>
      </Box>
    );
  }

  // Если пользователь гость — показываем WelcomePage
  if (!user || user.isGuest) {
    return (
      <WelcomePage
        onLoginClick={() => setShowAuth(false)}
        onRegisterClick={() => setShowAuth(false)}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        🛒 {t('checkout')}
      </Typography>

      {/* Степпер */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{t(label)}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Ошибка */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Контент шага */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      {/* Кнопки навигации */}
      {activeStep < 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            {t('back')}
          </Button>
          
          <Box>
            {activeStep === steps.length - 2 ? (
              <Button
                variant="contained"
                onClick={handleSubmitOrder}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                sx={{ backgroundColor: '#4CAF50' }}
              >
                {loading ? t('processing') : t('place_order')}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ backgroundColor: '#4CAF50' }}
              >
                {t('next')}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutPage; 
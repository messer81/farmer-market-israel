import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Chip } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Order, OrderStatus, PaymentMethod } from '../../types';
import { useTranslation } from 'react-i18next';

const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(state => state.user.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        // Временно получаем все заказы без фильтра
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Заказ:', data);
          
          // Проверяем структуру данных и обрабатываем возможные ошибки
          try {
            ordersData.push({
              id: doc.id,
              userId: data.userId || 'unknown',
              items: data.items || [],
              total: data.total || 0,
              status: data.status || OrderStatus.PENDING,
              deliveryAddress: data.deliveryAddress || {},
              paymentMethod: data.paymentMethod || PaymentMethod.CASH,
              paymentId: data.paymentId || null,
              notes: data.notes || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          } catch (error) {
            console.error('Ошибка обработки заказа:', error, data);
          }
        });
        setOrders(ordersData);
      } catch (error) {
        setError(t('order_history_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'warning';
      case OrderStatus.CONFIRMED: return 'info';
      case OrderStatus.PREPARING: return 'primary';
      case OrderStatus.SHIPPING: return 'secondary';
      case OrderStatus.DELIVERED: return 'success';
      case OrderStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH: return t('cash_on_delivery');
      case PaymentMethod.CARD: return t('credit_card');
      case PaymentMethod.PAYPAL: return 'PayPal';
      default: return method;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧾 {t('order_history')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        userId: {user?.id} email: {user?.email}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{t('date_time')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('total')}</TableCell>
                <TableCell>{t('payment')}</TableCell>
                <TableCell>{t('products')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.createdAt.toLocaleDateString('ru-RU')} {order.createdAt.toLocaleTimeString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Chip label={order.status} color={getStatusColor(order.status) as any} size="small" />
                  </TableCell>
                  <TableCell>₪{order.total.toFixed(2)}</TableCell>
                  <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
                  <TableCell>
                    {order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {orders.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          {t('no_orders_yet')}
        </Typography>
      )}
    </Box>
  );
};

export default OrderHistory; 
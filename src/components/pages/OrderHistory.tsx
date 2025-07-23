import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Chip } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Order, OrderStatus, PaymentMethod, getProductName } from '../../types';
import { useTranslation } from 'react-i18next';

const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(state => state.user.user);
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // Получаем заказы для текущего пользователя
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Проверяем структуру данных и обрабатываем возможные ошибки
          try {
            // Безопасная обработка дат - НИКОГДА НЕ ИЗМЕНЯЕМ ДАННЫЕ ИЗ FIREBASE
            let createdAt: Date;
            let updatedAt: Date;
            
            // Простая обработка даты
            if (data.createdAt && typeof data.createdAt === 'object' && data.createdAt.toDate) {
              // Это Firestore Timestamp
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt instanceof Date) {
              // Это уже Date объект
              createdAt = data.createdAt;
            } else {
              // Fallback - используем текущее время
              createdAt = new Date();
            }
            
            // Простая обработка updatedAt
            if (data.updatedAt && typeof data.updatedAt === 'object' && data.updatedAt.toDate) {
              // Это Firestore Timestamp
              updatedAt = data.updatedAt.toDate();
            } else if (data.updatedAt instanceof Date) {
              // Это уже Date объект
              updatedAt = data.updatedAt;
            } else {
              // Если нет updatedAt - используем createdAt
              updatedAt = createdAt;
            }
            
            const order: Order = {
              id: doc.id,
              userId: data.userId || 'unknown',
              items: data.items || [],
              total: data.total || 0,
              status: data.status || OrderStatus.PENDING,
              deliveryAddress: data.deliveryAddress || {},
              paymentMethod: data.paymentMethod || PaymentMethod.CASH,
              paymentId: data.paymentId || null,
              notes: data.notes || '',
              createdAt: createdAt,
              updatedAt: updatedAt,
            };
            
            ordersData.push(order);
          } catch (error: any) {
            console.error('❌ OrderHistory: Ошибка обработки заказа:', error, data);
          }
        });
        
        setOrders(ordersData);
      } catch (error: any) {
        console.error('❌ OrderHistory: Ошибка загрузки заказов:', error);
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
                     {order.items.map((orderItem: any) => {
                       try {
                         // Проверяем структуру orderItem
                         if (!orderItem) {
                           console.warn('⚠️ OrderHistory: orderItem пустой:', orderItem);
                           return 'Unknown Product x1';
                         }
                         
                         // Проверяем, какая структура у orderItem
                         if (orderItem.product) {
                           // Новая структура: { product: Product, quantity: number }
                           const productName = getProductName(orderItem.product, currentLanguage) || 'Unknown Product';
                           return `${productName} x${orderItem.quantity || 1}`;
                         } else if (orderItem.id && orderItem.name) {
                           // Старая структура: CartItem extends Product (прямо продукт с quantity)
                           console.log('🔄 OrderHistory: Обрабатываем старую структуру orderItem:', orderItem);
                           const productName = getProductName(orderItem, currentLanguage) || 'Unknown Product';
                           return `${productName} x${orderItem.quantity || 1}`;
                         } else {
                           console.warn('⚠️ OrderHistory: Неизвестная структура orderItem:', orderItem);
                           return 'Unknown Product x1';
                         }
                       } catch (error) {
                         console.error('❌ OrderHistory: Ошибка получения названия продукта:', error, orderItem);
                         return 'Unknown Product x1';
                       }
                     }).join(', ')}
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
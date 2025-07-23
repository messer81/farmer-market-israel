import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  ButtonGroup,
} from '@mui/material';
import { Download, Refresh, TableChart } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Order, OrderStatus, PaymentMethod } from '../../types';
import * as XLSX from 'xlsx';

const OrdersExport: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Проверяем структуру данных и обрабатываем возможные ошибки
        try {
          // Безопасная обработка дат
          let createdAt: Date;
          let updatedAt: Date;
          
          // Проверяем createdAt
          if (data.createdAt && typeof data.createdAt === 'object' && data.createdAt.toDate) {
            // Это Firestore Timestamp
            createdAt = data.createdAt.toDate();
          } else if (data.createdAt && typeof data.createdAt === 'object' && Object.keys(data.createdAt).length === 0) {
            // Пустой объект - используем текущую дату
            console.warn('⚠️ OrdersExport: createdAt пустой объект, используем текущую дату');
            createdAt = new Date();
          } else if (data.createdAt instanceof Date) {
            // Это уже Date объект
            createdAt = data.createdAt;
          } else {
            // Fallback - текущая дата
            createdAt = new Date();
          }
          
          // Проверяем updatedAt
          if (data.updatedAt && typeof data.updatedAt === 'object' && data.updatedAt.toDate) {
            // Это Firestore Timestamp
            updatedAt = data.updatedAt.toDate();
          } else if (data.updatedAt && typeof data.updatedAt === 'object' && Object.keys(data.updatedAt).length === 0) {
            // Пустой объект - используем текущую дату
            console.warn('⚠️ OrdersExport: updatedAt пустой объект, используем текущую дату');
            updatedAt = new Date();
          } else if (data.updatedAt instanceof Date) {
            // Это уже Date объект
            updatedAt = data.updatedAt;
          } else {
            // Fallback - текущая дата
            updatedAt = new Date();
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

          console.log('✅ OrdersExport: Успешно обработан заказ:', order);
          
          // Диагностика структуры items
          if (order.items && order.items.length > 0) {
            console.log('📦 OrdersExport: Структура items для заказа', order.id, ':', order.items);
            order.items.forEach((item, index) => {
              if (!item.product) {
                console.warn('⚠️ OrdersExport: item.product undefined для item', index, 'в заказе', order.id);
              }
            });
          }
          
          ordersData.push(order);
        } catch (error) {
          console.error('Ошибка обработки заказа в админке:', error, data);
        }
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setError(t('order_history_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const exportToCSV = () => {
    if (orders.length === 0) return;

    // Подготавливаем данные для CSV
    const csvData = [
      [
        t('order_id'),
        t('date_time'),
        t('client'),
        t('phone'),
        t('address'),
        t('payment_method'),
        t('status'),
        t('total'),
        t('products'),
        t('notes')
      ]
    ];

    orders.forEach(order => {
      const itemsText = order.items.map((orderItem: any) => {
        // Теперь у нас правильная структура OrderItem: { product: Product, quantity: number }
        const productName = orderItem.product?.name || 'Unknown Product';
        return `${productName} x${orderItem.quantity}`;
      }).join('; ');
      
      csvData.push([
        order.id,
        `${order.createdAt.toLocaleDateString('ru-RU')} ${order.createdAt.toLocaleTimeString('ru-RU')}`,
        order.deliveryAddress.name || '',
        order.deliveryAddress.phone || '',
        `${order.deliveryAddress.address || ''}, ${order.deliveryAddress.city || ''}`,
        order.paymentMethod,
        order.status,
        `₪${order.total.toFixed(2)}`,
        itemsText,
        order.notes || ''
      ]);
    });

    // Создаем CSV файл с правильной кодировкой
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Добавляем BOM для правильной кодировки UTF-8
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { 
      type: 'text/csv;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (orders.length === 0) return;

    // Подготавливаем данные для Excel
    const excelData = [
      [
        t('order_id'),
        t('date_time'),
        t('client'),
        t('phone'),
        t('address'),
        t('payment_method'),
        t('status'),
        t('total'),
        t('products'),
        t('notes')
      ]
    ];

    orders.forEach(order => {
      const itemsText = order.items.map((orderItem: any) => {
        // Теперь у нас правильная структура OrderItem: { product: Product, quantity: number }
        const productName = orderItem.product?.name || 'Unknown Product';
        return `${productName} x${orderItem.quantity}`;
      }).join('; ');
      
      excelData.push([
        order.id,
        `${order.createdAt.toLocaleDateString('ru-RU')} ${order.createdAt.toLocaleTimeString('ru-RU')}`,
        order.deliveryAddress.name || '',
        order.deliveryAddress.phone || '',
        `${order.deliveryAddress.address || ''}, ${order.deliveryAddress.city || ''}`,
        order.paymentMethod,
        order.status,
        `₪${order.total.toFixed(2)}`,
        itemsText,
        order.notes || ''
      ]);
    });

    // Создаем рабочую книгу Excel
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Заказы');

    // Экспортируем файл
    XLSX.writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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
        📊 {t('export_orders')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          disabled={loading}
        >
          {t('refresh_orders')}
        </Button>
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<Download />}
            onClick={exportToCSV}
            disabled={orders.length === 0}
          >
            {t('export_to_csv')}
          </Button>
          <Button
            startIcon={<TableChart />}
            onClick={exportToExcel}
            disabled={orders.length === 0}
          >
            {t('export_to_excel')}
          </Button>
        </ButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                <TableCell>{t('client')}</TableCell>
                <TableCell>{t('phone')}</TableCell>
                <TableCell>{t('address')}</TableCell>
                <TableCell>{t('payment')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('total')}</TableCell>
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
                  <TableCell>{order.deliveryAddress.name || ''}</TableCell>
                  <TableCell>{order.deliveryAddress.phone || ''}</TableCell>
                  <TableCell>
                    {order.deliveryAddress.address || ''}, {order.deliveryAddress.city || ''}
                  </TableCell>
                  <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₪{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.items.map((orderItem: any) => 
                      `${orderItem.product?.name || 'Unknown Product'} x${orderItem.quantity}`
                    ).join(', ')}
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

export default OrdersExport; 
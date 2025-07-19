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
        ordersData.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          total: data.total,
          status: data.status,
          deliveryAddress: data.deliveryAddress,
          paymentMethod: data.paymentMethod,
          paymentId: data.paymentId,
          notes: data.notes,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setError('Ошибка загрузки заказов');
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
        'ID заказа',
        'Дата и время',
        'Клиент',
        'Телефон',
        'Адрес',
        'Способ оплаты',
        'Статус',
        'Сумма',
        'Товары',
        'Примечания'
      ]
    ];

    orders.forEach(order => {
      const itemsText = order.items.map(item => 
        `${item.product.name} x${item.quantity}`
      ).join('; ');
      
      csvData.push([
        order.id,
        `${order.createdAt.toLocaleDateString('ru-RU')} ${order.createdAt.toLocaleTimeString('ru-RU')}`,
        order.deliveryAddress.name,
        order.deliveryAddress.phone,
        `${order.deliveryAddress.address}, ${order.deliveryAddress.city}`,
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
        'ID заказа',
        'Дата и время',
        'Клиент',
        'Телефон',
        'Адрес',
        'Способ оплаты',
        'Статус',
        'Сумма',
        'Товары',
        'Примечания'
      ]
    ];

    orders.forEach(order => {
      const itemsText = order.items.map(item => 
        `${item.product.name} x${item.quantity}`
      ).join('; ');
      
      excelData.push([
        order.id,
        `${order.createdAt.toLocaleDateString('ru-RU')} ${order.createdAt.toLocaleTimeString('ru-RU')}`,
        order.deliveryAddress.name,
        order.deliveryAddress.phone,
        `${order.deliveryAddress.address}, ${order.deliveryAddress.city}`,
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
      case PaymentMethod.CASH: return 'Наличные';
      case PaymentMethod.CARD: return 'Карта';
      case PaymentMethod.PAYPAL: return 'PayPal';
      default: return method;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Управление заказами
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Обновить
        </Button>
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<Download />}
            onClick={exportToCSV}
            disabled={orders.length === 0}
          >
            CSV
          </Button>
          <Button
            startIcon={<TableChart />}
            onClick={exportToExcel}
            disabled={orders.length === 0}
          >
            Excel
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
                <TableCell>Дата и время</TableCell>
                <TableCell>Клиент</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Адрес</TableCell>
                <TableCell>Оплата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Товары</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.createdAt.toLocaleDateString('ru-RU')} {order.createdAt.toLocaleTimeString('ru-RU')}
                  </TableCell>
                  <TableCell>{order.deliveryAddress.name}</TableCell>
                  <TableCell>{order.deliveryAddress.phone}</TableCell>
                  <TableCell>
                    {order.deliveryAddress.address}, {order.deliveryAddress.city}
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
                    {order.items.map(item => 
                      `${item.product.name} x${item.quantity}`
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
          Заказов пока нет
        </Typography>
      )}
    </Box>
  );
};

export default OrdersExport; 
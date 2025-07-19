// 🥬 Продукт
export interface Product {
  id: string;
  name: string;
  nameHe: string;          // Название на иврите
  price: number;
  currency: 'ILS' | 'USD'; // Шекели или доллары
  category: ProductCategory;
  description: string;
  image: string;
  farmId: string;
  farmName: string;
  location: string;
  organic: boolean;
  inStock: boolean;
  unit: 'kg' | 'piece' | 'bunch';
}

// 🏷️ Категории продуктов
export enum ProductCategory {
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  HERBS = 'herbs',
  DAIRY = 'dairy',
  HONEY = 'honey',
  FLOWERS = 'flowers'
}

// 🛒 Заказ
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 📦 Элемент корзины
export interface CartItem {
  product: Product;
  quantity: number;
}

// 🚚 Адрес доставки
export interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes?: string;
}

// 💳 Способ оплаты
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  PAYPAL = 'paypal'
}

// 📋 Статус заказа
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// 🛒 Элемент корзины
export interface CartItem {
  product: Product;
  quantity: number;
}

// 🏪 Ферма
export interface Farm {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  contact: string;
  certified: boolean;
}

// 👤 Пользователь
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredLanguage: 'he' | 'en' | 'ru';
} 
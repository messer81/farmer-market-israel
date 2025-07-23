// 🥬 Продукт
export interface Product {
  id: string;
  name: string;
  nameEn?: string;           // Название на английском
  nameRu?: string;           // Название на русском
  nameHe: string;            // Название на иврите
  price: number;
  currency: 'ILS' | 'USD'; // Шекели или доллары
  category: ProductCategory;
  description: string;
  descriptionEn?: string;    // Описание на английском
  descriptionRu?: string;    // Описание на русском
  descriptionHe?: string;    // Описание на иврите
  image: string;
  farmId: string;
  farmName: string;
  location: string;
  organic: boolean;
  inStock: boolean;
  unit: 'kg' | 'piece' | 'bunch';
  rating?: number;
  reviews?: number;
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
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 📦 Элемент заказа/корзины (унифицированная структура)
export interface OrderItem {
  product: Product;
  quantity: number;
}

// 🛒 Элемент корзины (для Redux store) - теперь использует ту же структуру
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
  isGuest?: boolean; // Гостевой пользователь
}

// 🌐 Функция для получения названия продукта на текущем языке
export const getProductName = (product: Product, language: string = 'he'): string => {
  switch (language) {
    case 'en':
      return product.nameEn || product.name;
    case 'ru':
      return product.nameRu || product.name;
    case 'he':
    default:
      return product.nameHe || product.name;
  }
};

// 🌐 Функция для получения описания продукта на текущем языке
export const getProductDescription = (product: Product, language: string = 'he'): string => {
  switch (language) {
    case 'en':
      return product.descriptionEn || product.description;
    case 'ru':
      return product.descriptionRu || product.description;
    case 'he':
    default:
      return product.descriptionHe || product.description;
  }
};

// 🔄 Функция для конвертации старой структуры CartItem в новую
export const convertOldCartItem = (oldItem: any): CartItem => {
  if (oldItem.product) {
    // Уже новая структура
    return oldItem;
  } else {
    // Старая структура (CartItem extends Product)
    const product: any = {
      id: oldItem.id,
      name: oldItem.name,
      nameEn: oldItem.nameEn,
      nameRu: oldItem.nameRu,
      nameHe: oldItem.nameHe,
      price: oldItem.price,
      currency: oldItem.currency,
      category: oldItem.category,
      description: oldItem.description,
      descriptionEn: oldItem.descriptionEn,
      descriptionRu: oldItem.descriptionRu,
      descriptionHe: oldItem.descriptionHe,
      image: oldItem.image,
      farmId: oldItem.farmId,
      farmName: oldItem.farmName,
      location: oldItem.location,
      organic: oldItem.organic,
      inStock: oldItem.inStock,
      unit: oldItem.unit
    };
    
    // Добавляем rating и reviews только если они не undefined
    if (oldItem.rating !== undefined) {
      product.rating = oldItem.rating;
    }
    if (oldItem.reviews !== undefined) {
      product.reviews = oldItem.reviews;
    }
    
    return {
      product,
      quantity: oldItem.quantity
    };
  }
}; 
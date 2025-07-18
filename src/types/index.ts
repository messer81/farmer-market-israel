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
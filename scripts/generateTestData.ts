import { db } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ProductCategory } from '../src/types';

// Тестовые данные продуктов
const testProducts = [
  {
    id: '1',
    name: 'Свежие помидоры',
    nameHe: 'עגבניות טריות',
    description: 'Свежие органические помидоры с фермы',
    descriptionHe: 'עגבניות אורגניות טריות מהחווה',
    price: 15.99,
    unit: 'кг',
    category: ProductCategory.VEGETABLES,
    farmName: 'Ферма Галилея',
    location: 'Галилея, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop',
    rating: 4.5,
    reviews: 23
  },
  {
    id: '2',
    name: 'Сладкие апельсины',
    nameHe: 'תפוזים מתוקים',
    description: 'Сладкие сочные апельсины',
    descriptionHe: 'תפוזים מתוקים ועסיסיים',
    price: 12.50,
    unit: 'кг',
    category: ProductCategory.FRUITS,
    farmName: 'Цитрусовая роща',
    location: 'Яффо, Израиль',
    organic: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 45
  },
  {
    id: '3',
    name: 'Свежий базилик',
    nameHe: 'בזיליקום טרי',
    description: 'Ароматный свежий базилик',
    descriptionHe: 'בזיליקום ריחני וטריות',
    price: 8.99,
    unit: 'пучок',
    category: ProductCategory.HERBS,
    farmName: 'Травяная ферма',
    location: 'Кармель, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400&h=300&fit=crop',
    rating: 4.2,
    reviews: 12
  },
  {
    id: '4',
    name: 'Домашний йогурт',
    nameHe: 'יוגורט ביתי',
    description: 'Натуральный домашний йогурт',
    descriptionHe: 'יוגורט טבעי ביתי',
    price: 18.50,
    unit: 'литр',
    category: ProductCategory.DAIRY,
    farmName: 'Молочная ферма',
    location: 'Голанские высоты, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 31
  },
  {
    id: '5',
    name: 'Мед из эвкалипта',
    nameHe: 'דבש אקליפטוס',
    description: 'Натуральный мед из эвкалиптовых цветов',
    descriptionHe: 'דבש טבעי מפרחי אקליפטוס',
    price: 45.00,
    unit: 'банка 500г',
    category: ProductCategory.HONEY,
    farmName: 'Пасека Шарон',
    location: 'Шарон, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 67
  },
  {
    id: '6',
    name: 'Розы',
    nameHe: 'ורדים',
    description: 'Свежие розы разных цветов',
    descriptionHe: 'ורדים טריים בצבעים שונים',
    price: 25.00,
    unit: 'букет',
    category: ProductCategory.FLOWERS,
    farmName: 'Цветочная ферма',
    location: 'Иерусалим, Израиль',
    organic: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 28
  },
  {
    id: '7',
    name: 'Огурцы',
    nameHe: 'מלפפונים',
    description: 'Свежие хрустящие огурцы',
    descriptionHe: 'מלפפונים טריים ופריכים',
    price: 9.99,
    unit: 'кг',
    category: ProductCategory.VEGETABLES,
    farmName: 'Овощная ферма',
    location: 'Негев, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop',
    rating: 4.3,
    reviews: 19
  },
  {
    id: '8',
    name: 'Авокадо',
    nameHe: 'אבוקדו',
    description: 'Спелые авокадо Хасс',
    descriptionHe: 'אבוקדו בשל מהזן האס',
    price: 22.50,
    unit: 'кг',
    category: ProductCategory.FRUITS,
    farmName: 'Тропическая ферма',
    location: 'Галилея, Израиль',
    organic: true,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 42
  },
  {
    id: '9',
    name: 'Мята',
    nameHe: 'נענע',
    description: 'Свежая мята для чая',
    descriptionHe: 'נענע טרייה לתה',
    price: 6.50,
    unit: 'пучок',
    category: ProductCategory.HERBS,
    farmName: 'Травяная ферма',
    location: 'Кармель, Израиль',
    organic: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400&h=300&fit=crop',
    rating: 4.1,
    reviews: 8
  },
  {
    id: '10',
    name: 'Сыр халуми',
    nameHe: 'גבינת חלומי',
    description: 'Традиционный кипрский сыр',
    descriptionHe: 'גבינה קפריסאית מסורתית',
    price: 35.00,
    unit: 'кг',
    category: ProductCategory.DAIRY,
    farmName: 'Сыроварня Галилея',
    location: 'Галилея, Израиль',
    organic: false,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 35
  }
];

// Функция для получения URL изображения (используем прямые ссылки)
async function getImageUrl(imageUrl: string, productId: string): Promise<string> {
  return imageUrl; // Просто возвращаем оригинальный URL
}

// Функция для добавления продуктов в Firestore
async function addProductsToFirestore() {
  try {
    console.log('Начинаем добавление продуктов...');
    
    for (const product of testProducts) {
      // Получаем URL изображения
      const imageUrl = await getImageUrl(product.image, product.id);
      
      // Создаем объект продукта с URL изображения
      const productData = {
        ...product,
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Добавляем в Firestore
      await addDoc(collection(db, 'products'), productData);
      console.log(`Продукт "${product.name}" добавлен`);
    }
    
    console.log('Все продукты успешно добавлены!');
  } catch (error) {
    console.error('Ошибка при добавлении продуктов:', error);
  }
}

// Запускаем скрипт
addProductsToFirestore(); 
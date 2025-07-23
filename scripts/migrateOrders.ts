import { db } from '../src/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { convertOldCartItem } from '../src/types';

/**
 * Скрипт миграции заказов со старой структуры на новую
 * Старая структура: items = [Product] (где Product содержит quantity)
 * Новая структура: items = [{ product: Product, quantity: number }]
 */

const migrateOrders = async () => {
  console.log('🔄 Начинаем миграцию заказов...');
  
  try {
    // Получаем все заказы
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    console.log(`📊 Найдено заказов: ${ordersSnapshot.size}`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data();
      const orderId = orderDoc.id;
      
      console.log(`🔍 Проверяем заказ ${orderId}...`);
      
      // Проверяем, нужна ли миграция
      const needsMigration = orderData.items && Array.isArray(orderData.items) && 
        orderData.items.length > 0 && 
        orderData.items[0] && 
        typeof orderData.items[0] === 'object' && 
        !orderData.items[0].product && 
        orderData.items[0].id; // Если нет поля product, но есть id, значит старая структура
      
      if (needsMigration) {
        console.log(`🔄 Мигрируем заказ ${orderId}...`);
        console.log(`📋 Старые items:`, orderData.items);
        
        try {
          // Мигрируем items
          const migratedItems = orderData.items.map((oldItem: any) => {
            console.log(`🔄 Мигрируем item:`, oldItem);
            return convertOldCartItem(oldItem);
          });
          
          console.log(`✅ Мигрированные items:`, migratedItems);
          
          // Обновляем заказ
          await updateDoc(doc(db, 'orders', orderId), {
            items: migratedItems
          });
          
          console.log(`✅ Заказ ${orderId} успешно мигрирован`);
          migratedCount++;
        } catch (error) {
          console.error(`❌ Ошибка миграции заказа ${orderId}:`, error);
          console.error(`📋 Данные заказа:`, orderData);
        }
      } else {
        console.log(`⏭️ Заказ ${orderId} уже в новой структуре, пропускаем`);
        skippedCount++;
      }
    }
    
    console.log('🎉 Миграция завершена!');
    console.log(`✅ Мигрировано заказов: ${migratedCount}`);
    console.log(`⏭️ Пропущено заказов: ${skippedCount}`);
    console.log(`📊 Всего обработано: ${migratedCount + skippedCount}`);
    
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  }
};

// Запускаем миграцию
migrateOrders(); 
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../farmer-market-israel-bce719b08775.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const COLLECTION = 'products'; // замени на свою коллекцию

async function importCollection() {
  const data = JSON.parse(fs.readFileSync('./backup/products.json', 'utf8'));
  for (const item of data) {
    const { id, ...fields } = item;
    await db.collection(COLLECTION).doc(id).set(fields, { merge: true });
    console.log('Импортирован:', id);
  }
  console.log('Импорт завершён!');
}

importCollection();
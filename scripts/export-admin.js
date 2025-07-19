 
  
  
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../farmer-market-israel-bce719b08775.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const COLLECTION = 'products'; // замени на свою коллекцию

async function exportCollection() {
  const snapshot = await db.collection(COLLECTION).get();
  const data = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  if (!fs.existsSync('./backup')) fs.mkdirSync('./backup');
  fs.writeFileSync(`./backup/${COLLECTION}.json`, JSON.stringify(data, null, 2));
  console.log('Экспорт завершён!');
}

exportCollection();
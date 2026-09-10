import { MongoClient } from 'mongodb';

// 1. Replace YOUR_PASSWORD_HERE with your real password.
// 2. Do NOT leave < > brackets around it.
const username = "Admin";
const password = "hello"; // Replace with your actual password
const cluster = "db01.i7se9xl.mongodb.net";
const dbName = "db01";

const uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority`;

console.log(`Connecting as user: "${username}"...`);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function runTest() {
  try {
    await client.connect();
    console.log('✅ CONNECTED SUCCESSFULLY TO MONGODB ATLAS!');
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
  } finally {
    await client.close();
  }
}

runTest();
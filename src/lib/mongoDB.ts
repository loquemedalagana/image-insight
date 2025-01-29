import { MongoClient } from 'mongodb';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
let client: MongoClient | null = null;
let isConnected = false; // ✅ 연결 상태 체크

export async function connectToDatabase() {
  if (!client) {
    console.log('🚀 Connecting to MongoDB...');
    try {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      isConnected = true;
      console.log('✅ MongoDB connected.');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      client = null;
      isConnected = false; // ✅ 연결 실패 처리
    }
  }
  return client ? client.db() : null;
}

/** ✅ MongoDB 연결 상태 확인 */
export function isMongoConnected(): boolean {
  return isConnected;
}

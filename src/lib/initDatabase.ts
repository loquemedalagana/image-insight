// src/lib/initDatabase.ts
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { databaseManager } from '@/lib/databaseManager';

let isInitialized = false;

export async function initializeDatabase() {
  if (!isInitialized) {
    console.log('🚀 Initializing database from local files...');

    const metadata = await extractMetadataFromLocal();
    await databaseManager.initializeDatabase(metadata); // ✅ MongoDB 또는 MockDB 사용

    isInitialized = true;
    console.log(`✅ Loaded ${metadata.length} files into database`);
  }
}

// tests/api/init-db.test.ts
import { initializeDatabase } from '@/lib/initDatabase';
import { databaseManager } from '@/lib/databaseManager';
import { isMongoConnected } from '@/lib/mongoDB';

describe('API: /api/init-db', () => {
  beforeEach(async () => {
    // DB 초기화 전에 기존 데이터 제거
    await databaseManager.initializeDatabase([]);
  });

  it('✅ should initialize the database successfully (MockDB)', async () => {
    process.env.USE_MONGO_DB = 'false';

    await initializeDatabase();
    const data = await databaseManager.findAll();

    expect(data.length).toBeGreaterThan(0);
  });

  it('✅ should initialize the database successfully (MongoDB)', async () => {
    process.env.USE_MONGO_DB = 'true';

    if (!isMongoConnected()) {
      console.warn('⚠️ Skipping MongoDB test as it is not connected.');
      return;
    }

    await initializeDatabase();
    const data = await databaseManager.findAll();

    expect(data.length).toBeGreaterThan(0);
  });

  it('❌ should return an error if database initialization fails', async () => {
    jest
      .spyOn(databaseManager, 'initializeDatabase')
      .mockRejectedValue(new Error('DB Init Error'));

    await expect(initializeDatabase()).rejects.toThrow('DB Init Error');
  });
});

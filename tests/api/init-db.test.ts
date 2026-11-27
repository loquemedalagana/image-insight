// tests/api/init-db.test.ts
import { jest } from '@jest/globals';
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
    // initDatabase는 모듈 수준 isInitialized 플래그를 가지고 있어서, 앞 테스트에서 이미
    // 초기화된 뒤에는 databaseManager를 다시 호출하지 않는다. 모듈을 새로 불러와
    // "아직 초기화되지 않은 상태에서 DB 초기화가 실패하는 경우"를 검증한다.
    jest.resetModules();
    const { databaseManager: freshManager } = await import(
      '@/lib/databaseManager'
    );
    const { initializeDatabase: freshInitializeDatabase } = await import(
      '@/lib/initDatabase'
    );

    jest
      .spyOn(freshManager, 'initializeDatabase')
      .mockRejectedValue(new Error('DB Init Error'));

    await expect(freshInitializeDatabase()).rejects.toThrow('DB Init Error');
  });
});

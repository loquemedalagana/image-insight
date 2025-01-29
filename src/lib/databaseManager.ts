// src/lib/databaseManager.ts
import { mockDatabase, MockDatabase } from '@/lib/mockDB';
import { connectToDatabase, isMongoConnected } from '@/lib/mongoDB';
import { Metadata } from '__generated__/graphql';

export class DatabaseManager {
  private readonly isMongoDB: boolean;
  private mockDB: MockDatabase;

  constructor() {
    this.isMongoDB = process.env.USE_MONGO_DB === 'true';
    this.mockDB = mockDatabase;
  }

  /** ✅ MongoDB 사용 가능 여부 체크 */
  private async useMongoDB(): Promise<boolean> {
    if (this.isMongoDB && isMongoConnected()) {
      return true;
    }
    return false;
  }

  /** ✅ 모든 메타데이터 조회 */
  async findAll(): Promise<Metadata[]> {
    if (await this.useMongoDB()) {
      const db = await connectToDatabase();
      if (!db) return this.mockDB.findAll(); // MongoDB 연결 실패 시 MockDB 사용
      return db
        .collection('metadata')
        .find()
        .toArray() as unknown as Metadata[];
    }
    return this.mockDB.findAll();
  }

  /** ✅ 특정 ID로 메타데이터 조회 */
  async findById(id: string): Promise<Metadata | null> {
    if (await this.useMongoDB()) {
      const db = await connectToDatabase();
      if (!db) return this.mockDB.findById(id);
      return (await db
        .collection('metadata')
        .findOne({ id })) as Metadata | null;
    }
    return this.mockDB.findById(id);
  }

  /** ✅ 메타데이터 추가 */
  async insert(data: Omit<Metadata, 'id'>): Promise<Metadata> {
    if (await this.useMongoDB()) {
      const db = await connectToDatabase();
      if (!db) return this.mockDB.insert(data);
      const result = await db
        .collection('metadata')
        .insertOne({ ...data, id: crypto.randomUUID() });
      return { ...data, id: result.insertedId.toString() };
    }
    return this.mockDB.insert(data);
  }

  /** ✅ 특정 ID의 메타데이터 삭제 */
  async deleteById(id: string): Promise<boolean> {
    if (await this.useMongoDB()) {
      const db = await connectToDatabase();
      if (!db) return this.mockDB.deleteById(id);
      const result = await db.collection('metadata').deleteOne({ id });
      return result.deletedCount > 0;
    }
    return this.mockDB.deleteById(id);
  }

  /** ✅ 초기화 */
  async initializeDatabase(metadata: Metadata[]) {
    if (await this.useMongoDB()) {
      const db = await connectToDatabase();
      if (!db) return this.mockDB.initializeDatabase(metadata);
      await db.collection('metadata').deleteMany({});
      await db.collection('metadata').insertMany(metadata);
    } else {
      await this.mockDB.initializeDatabase(metadata);
    }
  }
}

/** ✅ 인스턴스 생성 */
export const databaseManager = new DatabaseManager();

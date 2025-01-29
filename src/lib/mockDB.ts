import { v4 as uuidv4 } from 'uuid';
import { Metadata, Category } from '__generated__/graphql';

export class MockDatabase {
  private metadataDB: Metadata[] = [];
  private categoryDB: Category[] = [];
  public isReady: boolean = false; // ✅ 서버 초기화 여부 추가

  constructor() {
    this.isReady = false;
  }

  /** ✅ 모든 메타데이터 조회 */
  async findAll(): Promise<Metadata[]> {
    return this.metadataDB;
  }

  /** ✅ 특정 ID로 메타데이터 조회 */
  async findById(id: string): Promise<Metadata | null> {
    return this.metadataDB.find((item) => item.id === id) || null;
  }

  /** ✅ 메타데이터 추가 */
  async insert(data: Omit<Metadata, 'id'>): Promise<Metadata> {
    const newData: Metadata = {
      id: uuidv4(), // 기존 ID 유지 (없으면 새로 생성)
      ...data,
      categories: data.categories.map((cat) =>
        typeof cat === 'string' ? this.findOrCreateCategory(cat) : cat,
      ), // ✅ string → Category 변환
    };
    this.metadataDB.push(newData);
    return newData;
  }

  /** ✅ 특정 ID의 메타데이터 삭제 */
  async deleteById(id: string): Promise<boolean> {
    const initialLength = this.metadataDB.length;
    this.metadataDB = this.metadataDB.filter((item) => item.id !== id);
    return this.metadataDB.length < initialLength;
  }

  /** ✅ DB 초기화 */
  async clear(): Promise<void> {
    this.metadataDB = [];
    this.categoryDB = [];
    this.isReady = false;
  }

  /** ✅ 모든 카테고리 조회 */
  async findAllCategories(): Promise<Category[]> {
    return this.categoryDB;
  }

  /** ✅ 특정 ID로 카테고리 조회 */
  findCategoryById(id: string): Category | null {
    return this.categoryDB.find((category) => category.id === id) || null;
  }

  /** ✅ 특정 이름으로 카테고리 조회 */
  findCategoryByName(name: string): Category | null {
    return this.categoryDB.find((category) => category.name === name) || null;
  }

  /** ✅ 새로운 카테고리 추가 (중복 검사 후 추가) */
  async insertCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const existingCategory = this.findCategoryByName(category.name);
    if (existingCategory) return existingCategory; // 이미 존재하면 기존 데이터 반환

    const newCategory: Category = { id: uuidv4(), name: category.name };
    this.categoryDB.push(newCategory);
    return newCategory;
  }

  /** ✅ 특정 카테고리 찾거나 생성 */
  private findOrCreateCategory(name: string): Category {
    const existingCategory = this.findCategoryByName(name);
    if (existingCategory) return existingCategory;

    const newCategory: Category = { id: uuidv4(), name };
    this.categoryDB.push(newCategory);
    return newCategory;
  }

  /** ✅ 서버가 준비되었는지 체크하는 함수 */
  async initializeDatabase(metadata: Metadata[]) {
    console.log('🚀 Initializing mock database...');

    this.metadataDB = metadata.map((item) => ({
      ...item,
      id: item.id ?? uuidv4(), // 기존 ID 유지
      categories: item.categories.map((cat) =>
        typeof cat === 'string' ? this.findOrCreateCategory(cat) : cat,
      ), // ✅ string → Category 변환
    }));

    this.isReady = true;
    console.log(`✅ Loaded ${this.metadataDB.length} metadata entries.`);
    console.log(`✅ Loaded ${this.categoryDB.length} categories.`);
  }
}

/** ✅ 인스턴스 생성 */
export const mockDatabase = new MockDatabase();

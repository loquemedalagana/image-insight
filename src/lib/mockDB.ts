import { v4 as uuidv4 } from 'uuid';
import { Metadata, Category } from '__generated__/graphql';

export interface Database {
  findAll(): Promise<Metadata[]>;
  findById(id: string): Promise<Metadata | null>;
  insert(data: Omit<Metadata, 'id'>): Promise<Metadata>;
  deleteById(id: string): Promise<boolean>;
  clear(): Promise<void>;

  // ✅ 카테고리 관련 메서드 추가
  findAllCategories(): Promise<Category[]>;
  findCategoryById(id: string): Category | null;
  findCategoryByName(name: string): Category | null;
  insertCategory(category: Omit<Category, 'id'>): Promise<Category>;
}

let mockDB: Metadata[] = [];
let categoryDB: Category[] = []; // ✅ 별도 카테고리 데이터베이스

export const mockDatabase: Database = {
  findAll: async () => {
    return mockDB;
  },

  findById: async (id: string) => {
    return mockDB.find((item) => item.id === id) || null;
  },

  insert: async (data: Omit<Metadata, 'id'>) => {
    const newData: Metadata = { id: uuidv4(), ...data };
    mockDB.push(newData);
    return newData;
  },

  deleteById: async (id: string) => {
    const initialLength = mockDB.length;
    mockDB = mockDB.filter((item) => item.id !== id);
    return mockDB.length < initialLength; // 삭제 성공 여부 반환
  },

  clear: async () => {
    mockDB = [];
    categoryDB = [];
  },

  // ✅ 모든 카테고리 조회
  findAllCategories: async () => {
    return categoryDB;
  },

  // ✅ ID로 카테고리 조회
  findCategoryById: (id: string) => {
    return categoryDB.find((category) => category.id === id) || null;
  },

  // ✅ 이름으로 카테고리 조회 (중복 방지)
  findCategoryByName: (name: string) => {
    return categoryDB.find((category) => category.name === name) || null;
  },

  // ✅ 새로운 카테고리 추가 (중복 검사 후 추가)
  insertCategory: async (category: Omit<Category, 'id'>) => {
    const existingCategory = mockDatabase.findCategoryByName(category.name);
    if (existingCategory) return existingCategory; // 이미 존재하면 기존 데이터 반환

    const newCategory: Category = { id: uuidv4(), ...category };
    categoryDB.push(newCategory);
    return newCategory;
  },
};

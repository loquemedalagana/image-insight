import { v4 as uuidv4 } from 'uuid';

export interface Database {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  insert(data: any): Promise<any>;
  deleteById(id: string): Promise<boolean>;
  clear(): Promise<void>;
}

let mockDB: any[] = [];

export const mockDatabase: Database = {
  findAll: async () => {
    return mockDB;
  },
  findById: async (id: string) => {
    return mockDB.find((item) => item.id === id) || null;
  },
  insert: async (data: any) => {
    const newData = { id: data.id ?? uuidv4(), ...data };
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
  },
};

// src/lib/mockDb.ts
import { v4 as uuidv4 } from 'uuid';

let mockDb: any[] = [];

export const mockDatabase = {
  findAll: () => mockDb,
  findById: (id: string) => mockDb.find((item) => item.id === id),
  deleteById: (id: string) => {
    const index = mockDb.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockDb.splice(index, 1);
      return true;
    }
    return false;
  },
  insert: (data: any) => {
    const newData = { id: uuidv4(), ...data };
    mockDb.push(newData);
    return newData;
  },
  clear: () => {
    mockDb = [];
  },
};

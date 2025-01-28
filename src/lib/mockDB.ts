import { v4 as uuidv4 } from 'uuid';

let mockDB: any[] = [];

export const mockDatabase = {
  // 모든 데이터 조회
  findAll: () => mockDB,

  // ID로 데이터 검색
  findById: (id: string) => mockDB.find((item) => item.id === id),

  // 데이터 삽입
  insert: (data: any) => {
    const newData = { id: uuidv4(), ...data };
    mockDB.push(newData);
    return newData;
  },

  // ID로 데이터 삭제
  deleteById: (id: string) => {
    const initialLength = mockDB.length;
    mockDB = mockDB.filter((item) => item.id !== id);
    return mockDB.length < initialLength; // 삭제 성공 여부 반환
  },

  // Mock DB 초기화
  clear: () => {
    mockDB = [];
  },
};

import { createHandler } from '@/app/api/graphql/server';

export default createHandler();

// Next.js 설정 (Body Parser 비활성화)
export const config = {
  api: {
    bodyParser: false,
  },
};

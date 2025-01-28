import { createHandler } from '@/app/api/graphql/server';

const handler = createHandler();

export const GET = handler;
export const POST = handler;

// Next.js 설정 (Body Parser 비활성화)
export const config = {
  api: {
    bodyParser: false,
  },
};

import { createHandler, databaseReady } from '@/app/api/graphql/server';

let handler: ReturnType<typeof createHandler> | undefined;

async function getHandler() {
  await databaseReady; // 샘플 로딩이 끝난 뒤에 응답
  if (!handler) {
    handler = await createHandler();
  }
  return handler;
}

export const GET = async (req: Request) => {
  const handler = await getHandler();
  return handler(req); // ✅ res 제거
};

export const POST = async (req: Request) => {
  const handler = await getHandler();
  return handler(req); // ✅ res 제거
};

import { createHandler } from '@/app/api/graphql/server';

let handler: any;

async function getHandler() {
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

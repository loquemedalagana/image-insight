import { createHandler } from '@/app/api/graphql/server';

let handler: any;

async function getHandler() {
  if (!handler) {
    handler = await createHandler(); // ✅ 핸들러를 한 번만 생성하여 저장
  }
  return handler;
}

export const GET = async (req: Request, res: Response) => {
  const handler = await getHandler();
  return handler(req, res);
};

export const POST = async (req: Request, res: Response) => {
  const handler = await getHandler();
  return handler(req, res);
};

// ✅ Next.js 설정 (Body Parser 비활성화)
export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/extractMetadata';

export async function GET() {
  const metadata = await extractMetadata();
  return NextResponse.json(metadata);
}

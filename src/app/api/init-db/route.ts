// src/app/api/init-db/route.ts
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/initDatabase';

export async function GET() {
  try {
    console.log('🚀 Received request to initialize database...');
    await initializeDatabase();
    return NextResponse.json({
      message: '✅ Database initialized successfully',
    });
  } catch (error) {
    console.error('❌ Database Initialization Failed:', error);
    return NextResponse.json(
      { error: '❌ Failed to initialize database' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    queueConfigured: Boolean(process.env.REDIS_URL),
    objectStorageConfigured: Boolean(
      process.env.OBJECT_STORAGE_ENDPOINT && process.env.OBJECT_STORAGE_BUCKET,
    ),
  };
  const configured = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      status: configured ? 'ok' : 'degraded',
      service: 'proof-of-action-api',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: configured ? 200 : 503 },
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Keep-alive endpoint — hit by Vercel cron every 5 minutes
// Warms up both the serverless function and the Neon DB connection
export async function GET() {
  try {
    // Lightweight query to keep Neon connection warm
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

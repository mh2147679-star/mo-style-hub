import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Look up the token
    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token: "reset" } },
    });

    if (!record || record.token !== token) {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    if (record.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: "reset" } },
      });
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update password + delete used token in a transaction
    const hashed = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashed },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: "reset" } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

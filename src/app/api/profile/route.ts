import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PATCH /api/profile — update name and/or password
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, currentPassword, newPassword } = await req.json();

    // ── Name update ──────────────────────────────────────────────────────────
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: trimmed },
      });
    }

    // ── Password change ──────────────────────────────────────────────────────
    if (newPassword !== undefined) {
      if (typeof newPassword !== "string" || newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }

      // Fetch current hashed password
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: "Password change is not available for OAuth accounts." },
          { status: 400 }
        );
      }

      const valid = await bcrypt.compare(String(currentPassword ?? ""), user.password);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[profile PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const FROM = process.env.EMAIL_FROM ?? "Mo Style Hub <orders@mostylehub.com>";

// Token expires in 1 hour
const EXPIRES_IN_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to avoid user enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + EXPIRES_IN_MS);

    // Upsert — one active reset token per email at a time
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: "reset" } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    });

    const resetUrl = `${APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset your Mo Style Hub password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#faf9f7;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background-color:#ffffff;border:1px solid #e8e4de;">
        <tr>
          <td style="background-color:#1a1a1a;padding:28px 40px;text-align:center;">
            <div style="font-size:20px;letter-spacing:6px;text-transform:uppercase;color:#ffffff;">Mo Style Hub</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;text-align:center;">
            <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;margin-bottom:12px;">Password Reset</div>
            <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 16px;font-weight:400;">Reset Your Password</h1>
            <p style="font-size:14px;color:#6b6b6b;line-height:1.6;margin:0 0 32px;">
              We received a request to reset the password for your account.<br />
              Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              Reset Password
            </a>
            <p style="font-size:12px;color:#9a9a9a;margin:32px 0 0;line-height:1.6;">
              If you didn't request this, you can safely ignore this email.<br />
              Your password will not change.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #e8e4de;text-align:center;">
            <p style="font-size:11px;color:#9a9a9a;margin:0;">© ${new Date().getFullYear()} Mo Style Hub. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

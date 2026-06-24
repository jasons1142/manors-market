import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Don't reveal whether the email exists
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a password reset email has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.deleteMany({
      where: {
        email: normalizedEmail,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000 // 1 hour
        ),
      },
    });

    const resetLink =
      `${process.env.NEXT_PUBLIC_APP_URL}` +
      `/reset-password?token=${token}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset Your Manor's Market Password",
      html: `
        <h1>Password Reset Request</h1>

        <p>
          Click the link below to reset your password:
        </p>

        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>

        <p>
          This link expires in 1 hour.
        </p>
      `,
    });

    return NextResponse.json({
      message:
        "If an account exists, a password reset email has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT_PASSWORD_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process password reset request.",
      },
      {
        status: 500,
      }
    );
  }
}
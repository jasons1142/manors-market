import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 400 }
      );
    }

    const code = generateCode();

    await prisma.emailVerificationCode.deleteMany({
      where: {
        email: normalizedEmail,
      },
    });

    await prisma.emailVerificationCode.create({
      data: {
        email: normalizedEmail,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Your New Verification Code",
      html: `
        <h1>Verify Your Email</h1>
        <p>Your new verification code is:</p>
        <h2>${code}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json({
      message: "Verification code sent.",
    });
  } catch (error) {
    console.error("RESEND_VERIFICATION_ERROR", error);

    return NextResponse.json(
      { error: "Failed to resend verification code." },
      { status: 500 }
    );
  }
}
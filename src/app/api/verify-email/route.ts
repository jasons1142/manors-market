import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verificationCode = await prisma.emailVerificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (verificationCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Verification code expired." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        email: normalizedEmail,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.emailVerificationCode.deleteMany({
      where: {
        email: normalizedEmail,
      },
    });

    return NextResponse.json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying email." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { registerRateLimit, getIp } from "@/lib/rate-limit";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const ip = getIp(req);

  const { success } = await registerRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: false,
      },
    });

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
      subject: "Verify your Manor's Market account",
      html: `
        <h1>Verify your email</h1>
        <p>Welcome to Manor's Market.</p>
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      {
        message: "Account created. Please verify your email.",
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      { error: "Something went wrong while registering." },
      { status: 500 }
    );
  }
}
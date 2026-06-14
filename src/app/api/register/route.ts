import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerRateLimit, getIp } from "@/lib/rate-limit";

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  const body = await req.json();

  const { name, description, price, stock, imageUrl } = body;

  if (!name || !description || !price || !stock) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
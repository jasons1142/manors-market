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

  const { name, description, price, stock, imageUrls} = body;

  if (!name || !description ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  let priceNumber = Number(price)
  let stockNumber = Number(stock)

  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    return NextResponse.json(
      { error: "Price must be a valid non-negative number." },
      { status: 400 }
    );
  }
  
  if (
    Number.isNaN(stockNumber) ||
    !Number.isInteger(stockNumber) ||
    stockNumber < 0
  ) {
    return NextResponse.json(
      { error: "Stock must be a valid non-negative integer." },
      { status: 400 }
    );
  }

  const validImageUrls =
  Array.isArray(imageUrls) &&
  imageUrls.every(
    (url) => typeof url === "string" && url.trim().length > 0
  );

  if (!validImageUrls) {
    return NextResponse.json(
      { error: "Images must be provided as valid URLs." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: {
        create: imageUrls.map((imageUrl: string, index: number) => ({
          imageUrl,
          position: index,
        }))
      }
    },
  });

  return NextResponse.json(product, { status: 201 });
}
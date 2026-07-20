import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return { session };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin();

  if (authCheck.error) {
    return authCheck.error;
  }

  const { id } = await params;

  const body = await req.json();
  const { name, description, price, stock, imageUrl } = body;

  if (!name || !description || price === undefined || stock === undefined) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: imageUrl,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireAdmin();

    if (authCheck.error) {
      return authCheck.error;
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it is part of an exisiting order"
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Could not delete product." },
      { status: 500 }
    );
  }
}
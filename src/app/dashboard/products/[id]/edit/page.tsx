import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditProductForm from "./edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <main className="p-6 space-y-6 bg-[#3d251e] min-h-screen">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <EditProductForm product={product} />
    </main>
  );
}
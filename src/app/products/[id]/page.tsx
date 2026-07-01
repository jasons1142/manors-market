import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="p-6 grid gap-8 md:grid-cols-2 bg-[#3d251e] min-h-screen">
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-2xl font-semibold">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-black text-2xl">{product.description}</p>

        {product.stock > 0 ? (
          <p className="text-green-600">In stock: {product.stock}</p>
        ) : (
          <p className="text-red-600">Out of stock</p>
        )}

        <AddToCartButton
        product={{
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
        }}
        />
      </div>
    </main>
  );
}
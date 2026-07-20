import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/add-to-cart-button";
import ProductImageGallery from "@/components/products/product-image-gallery";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.imageUrl;

  return (
    <main className="p-6 grid gap-8 md:grid-cols-2 bg-[#3d251e] min-h-screen">
      <ProductImageGallery
        images={product.images}
        productName={product.name}
      />

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
            imageUrl: primaryImage ?? "",
        }}
        />
      </div>
    </main>
  );
}
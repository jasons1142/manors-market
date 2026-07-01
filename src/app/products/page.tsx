import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 space-y-6 bg-[#3d251e] min-h-screen">
      <div>
        <p className="text-white mt-2 text-xl">
          Browse our available products.
        </p>
      </div>

      {products.length === 0 ? (
        <p>No products available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
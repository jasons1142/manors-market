import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shop Manor&apos;s Market</h1>
        <p className="text-gray-600 mt-2">
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
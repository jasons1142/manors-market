import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <section className="px-6 py-16 text-center bg-gray-100">
        <h1 className="text-4xl font-bold">
          Welcome to Manor&apos;s Market
        </h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Quality products, carefully selected and easy to order.
        </p>

        <Link
          href="/products"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
        >
          Shop Products
        </Link>
      </section>

      <section className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>

          <Link href="/products" className="underline">
            View all
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

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
      <section className="px-6 py-16 text-center bg-[#f5e6c8]">
        <h1 className="text-4xl font-bold text-green-800">
          Welcome to Manor&apos;s Market
        </h1>

        <p className="text-[#964B00] mt-4 max-w-2xl mx-auto">
          Your One Stop Shop For Carribean Products
        </p>

        <Link
          href="/products"
          className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg"
        >
          Shop Products
        </Link>
      </section>

      <section className="p-6 space-y-6 bg-[#f5e6c8]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Featured Products</h2>

          <Link href="/products" className="underline text-amber-800">
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

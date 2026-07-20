import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    take: 3,
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="bg-[#3d251e] min-h-screen">
      <section className="px-6 py-16 text-center bg-[#3d251e]">
        <h1 className="text-4xl font-bold text-white">
          Welcome to Manor&apos;s Market
        </h1>

        <Link
          href="/products"
          className="inline-block mt-20 bg-green-800 text-[#3d251e] px-6 py-3 rounded-lg"
        >
          Shop Products
        </Link>
      </section>

      <section className="p-6 space-y-6 bg-[#3d251e]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#DCC7A6]">Featured Products</h2>

          <Link href="/products" className="underline text-[#DCC7A6]">
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

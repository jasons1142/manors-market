import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string}>;
}) {

  const { search } = await searchParams;

  const query = search?.trim() || "";

  const products = await prisma.product.findMany({
    where: query 
      ? {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      }
    : undefined,
    orderBy: {
      createdAt: "desc",
    } 
  });

  

  return (
    <main className="p-6 space-y-6 bg-[#3d251e] min-h-screen">
      <p className="flex text-white mt-2 text-xl justify-center items-center">
          Browse our available products.
        </p>
      <div className="flex justify-center items-center">
        <form className="flex w-full max-w-md overflow-hidden rounded-lg border bg-white text-black">
          <input
            name="search"
            defaultValue={query}
            placeholder="Search products..."
            className="flex-1 p-3 outline-none"
          />

          <button className="bg-[#DCC7A6] px-5 text-[#3d251e] font-medium hover:bg-[#cbb68f]">
            Search
          </button>
        </form>
      </div>

      
        {query && (
          <p className="text-sm text-black flex justify-center items-center">
            Showing results for "{query}"
          </p>
        )}

        {query && (
          <Link href="/products" className="underline flex justify-center items-center">
            Clear search
          </Link>
        )}
      

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
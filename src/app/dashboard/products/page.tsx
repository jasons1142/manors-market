import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 space-y-6 bg-[#f5e6c8] min-h-screen">
      <div className="flex items-center justify-between text-black">
        <h1 className="text-2xl font-bold">Manage Products</h1>

        <Link
          href="/dashboard/products/new"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid gap-4 text-black">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p>${product.price}</p>
                <p>Stock: {product.stock}</p>
              </div>

              <Link
                href={`/dashboard/products/${product.id}/edit`}
                className="underline"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
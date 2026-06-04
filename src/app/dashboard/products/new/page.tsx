import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductForm from "./product-form";

export default async function NewProductPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="p-6 space-y-6 bg-[#3d251e] min-h-screen text-black place-items-center">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <ProductForm />
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const imageUrl = formData.get("imageUrl");

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        price,
        stock,
        imageUrl,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && <p className="text-red-500">{error}</p>}

      <input
        name="name"
        placeholder="Product name"
        className="w-full border rounded-lg p-3"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border rounded-lg p-3"
        required
      />

      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        className="w-full border rounded-lg p-3"
        required
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        className="w-full border rounded-lg p-3"
        required
      />

      <input
        name="imageUrl"
        placeholder="Image URL for now"
        className="w-full border rounded-lg p-3"
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
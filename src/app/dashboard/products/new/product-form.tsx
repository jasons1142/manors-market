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
    
    let imageUrl = formData.get("imageUrl");

    const imageFile = formData.get("image") as File;

    if (imageFile && imageFile.size > 0) {
    const uploadData = new FormData();
    uploadData.append("file", imageFile);

    const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
    });

    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok) {
        setError(uploadJson.error || "Image upload failed.");
        setLoading(false);
        return;
    }

    imageUrl = uploadJson.imageUrl;
    }

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
    <form onSubmit={handleSubmit} className="grid space-y-4 max-w-lg place-items-center text-[#DCC7A6]">
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
        name="image"
        type="file"
        accept="image/*"
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
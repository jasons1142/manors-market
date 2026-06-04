"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    setError("");
    setLoading(true);
  
    try {
      const formData = new FormData(e.currentTarget);
  
      let imageUrl: string | null = product.imageUrl;
  
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
          return;
        }
  
        imageUrl = uploadJson.imageUrl;
      }
  
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: formData.get("price"),
          stock: formData.get("stock"),
          imageUrl,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
  
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      console.error("UPDATE_PRODUCT_ERROR", err);
      setError("Could not update product. Check your terminal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setError("");
    setDeleting(true);

    const res = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setDeleting(false);
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <div className="max-w-lg space-y-6 ">
      <form onSubmit={handleUpdate} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <input
          name="name"
          defaultValue={product.name}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          defaultValue={product.description}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="stock"
          type="number"
          defaultValue={product.stock}
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
          disabled={loading || deleting}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button
        onClick={handleDelete}
        disabled={loading || deleting}
        className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Product"}
      </button>
    </div>
  );
}
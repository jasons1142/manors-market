"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    setError("");
    setLoading(true);
  
    try {
      const formData = new FormData(e.currentTarget);
  
      const imageUrls: string[] = [];

      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) {
          throw new Error(uploadJson.error || "Image upload failed.");
      }

      imageUrls.push(uploadJson.imageUrl)
    }

      const updateBody = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),

        // Only send imageUrls when new images were selected.
        ...(imageUrls.length > 0 && { imageUrls }),
      }

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateBody),
      });
  
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
  
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
  
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      console.error("UPDATE_PRODUCT_ERROR", err);
      setError(
        err instanceof Error
        ? err.message 
        : "Could not update product. Check your terminal"
      );
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
    
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      console.error("DELETE_PRODUCT_ERROR", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not delete product. Check your terminal."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6 ">
      <form onSubmit={handleUpdate} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <input
          name="name"
          defaultValue={product.name}
          className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
          required
        />

        <textarea
          name="description"
          defaultValue={product.description}
          className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
          required
        />

        <input
          name="stock"
          type="number"
          defaultValue={product.stock}
          className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
          required
        />

        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setSelectedFiles(files);
          }}
          className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
        />

        {selectedFiles.length > 0 && (
          <div className="w-full">
            <p className="font-medium text-black">
              {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "image" : "images"} selected
            </p>

            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {selectedFiles.map((file, index) => (
                <li key={`${file.name}-${index}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || deleting}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading || deleting}
        className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Product"}
      </button>
    </div>
  );
}
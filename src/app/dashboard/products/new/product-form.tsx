"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
          setError(uploadJson.error || "Image upload failed.");
          setLoading(false);
          return;
      }

      imageUrls.push(uploadJson.imageUrl)
    }

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        price,
        stock,
        imageUrls,
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
    <form onSubmit={handleSubmit} className="grid space-y-4 max-w-lg place-items-center">
      {error && <p className="text-red-500">{error}</p>}

      <input
        name="name"
        placeholder="Product name"
        className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
        required
      />

      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        className="w-full border rounded-lg p-3 bg-[#DCC7A6] text-black"
        required
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
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
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
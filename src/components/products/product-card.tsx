import Link from "next/link";
import { Product } from "@prisma/client";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-xl p-4 hover:shadow-md transition block"
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>

      <h2 className="font-semibold text-lg">{product.name}</h2>

      <p className="text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold">${product.price.toFixed(2)}</p>

        {product.stock > 0 ? (
          <p className="text-sm text-green-600">In stock</p>
        ) : (
          <p className="text-sm text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
import Link from "next/link";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true;
  };
}>;

export default function ProductCard({ product }: { product: ProductWithImages }) {
  const primaryImage = product.images[0]?.imageUrl;

  console.log(product.name, product.images);
  console.log("Primary image:", primaryImage);

  return (
    <Link
      href={`/products/${product.id}`}
      className="border bg-[#e5d3b3] rounded-xl p-4 hover:shadow-md transition block"
    >
      <div className="aspect-square bg-black-100 rounded-lg mb-4 flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-black">No image</span>
        )}
      </div>

      <h2 className="font-semibold text-lg text-[#3d251e]">{product.name}</h2>

      <p className="text-sm text-[#3d251e] line-clamp-2">
        {product.description}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold text-[#3d251e]">${product.price.toFixed(2)}</p>

        {product.stock > 0 ? (
          <p className="text-sm text-green-600">In stock</p>
        ) : (
          <p className="text-sm text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
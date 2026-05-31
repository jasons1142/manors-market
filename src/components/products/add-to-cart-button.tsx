"use client";

import { useCart } from "@/context/cart-context";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
}

export default function AddToCartButton({
  product,
}: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          ...product,
          quantity: 1,
        })
      }
      className="bg-white text-black px-6 py-3 rounded-lg active:bg-gray-200 active:scale-95 active:shadow-inner transition-all duration-150"
    >
      Add To Cart
    </button>
  );
}
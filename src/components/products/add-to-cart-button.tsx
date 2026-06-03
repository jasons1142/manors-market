"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [success, setSuccess] = useState("");

  function handleAddToCart() {
    addToCart({
      ...product,
      quantity: 1,
    });

    setSuccess(`${product.name} added to cart!`);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddToCart}
        className="bg-white text-black px-6 py-3 rounded-lg active:bg-gray-200 active:scale-95 active:shadow-inner transition-all duration-150"
      >
        Add To Cart
      </button>

      {success && (
        <p className="text-green-600 font-medium">
          ✓ {success}
        </p>
      )}
    </div>
  );
}
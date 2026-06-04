"use client";

import { useCart } from "@/context/cart-context";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    addToCart,
    reduceQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="p-6 space-y-6 bg-[#3d251e] min-h-screen">
      <div className="flex items-center justify-between text-[#DCC7A6]">
        <h1 className="text-3xl font-bold text-[#DCC7A6]">Shopping Cart</h1>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="border px-4 py-2 rounded-lg"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-[#DCC7A6]">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 text-black">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 flex justify-between gap-4 bg-[#DCC7A6]"
              >
                <div className="text-green">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>${item.price.toFixed(2)} each</p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => reduceQuantity(item.id)}
                      className="border px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      readOnly
                      className="border rounded w-16 text-center"
                    />

                    <button
                      onClick={() =>
                        addToCart({
                          ...item,
                          quantity: 1,
                        })
                      }
                      className="border px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 mt-3"
                  >
                    Remove
                  </button>
                </div>

                <p className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4 text-[#DCC7A6]">
            <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <Link
                href="/checkout"
                className="block text-center bg-black text-white p-3 rounded-lg"
            >
                Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
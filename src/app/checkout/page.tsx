"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const checkoutData = {
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      shippingAddress: {
        addressLine1: formData.get("addressLine1"),
        addressLine2: formData.get("addressLine2"),
        city: formData.get("city"),
        state: formData.get("state"),
        postalCode: formData.get("postalCode"),
        country: "US",
      },
      items,
      total,
    };

    console.log("CHECKOUT_DATA", checkoutData);

    const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
    });
      
    const data = await res.json();
      
    if (!res.ok) {
        alert(data.error || "Something went wrong.");
        setLoading(false);
        return;
    }
      
    window.location.href = data.url;

    setLoading(false);
  }

  return (
    <main className="p-6 grid gap-8 lg:grid-cols-2">
      <section>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>

          <input
            name="name"
            placeholder="Full name"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            className="w-full border rounded-lg p-3"
          />

          <h2 className="text-xl font-semibold pt-4">Shipping Address</h2>

          <input
            name="addressLine1"
            placeholder="Address line 1"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="addressLine2"
            placeholder="Address line 2"
            className="w-full border rounded-lg p-3"
          />

          <input
            name="city"
            placeholder="City"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="state"
            placeholder="State"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="postalCode"
            placeholder="ZIP code"
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Preparing checkout..." : "Continue to Payment"}
          </button>
        </form>
      </section>

      <section className="border rounded-xl p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity}
                </p>
              </div>

              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>
    </main>
  );
}
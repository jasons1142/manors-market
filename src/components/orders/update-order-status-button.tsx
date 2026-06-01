"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateOrderStatusButton({
  orderId,
  nextStatus,
  label,
}: {
  orderId: string;
  nextStatus: string;
  label: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    if (res.ok) {
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <button
      onClick={updateStatus}
      disabled={loading}
      className="border px-4 py-2 rounded-lg disabled:opacity-50"
    >
      {loading ? "Updating..." : label}
    </button>
  );
}
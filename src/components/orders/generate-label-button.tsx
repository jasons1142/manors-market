"use client";

import { useState } from "react";

export default function GenerateLabelButton({
  orderId,
  existingLabelUrl,
  existingTrackingNumber,
}: {
  orderId: string;
  existingLabelUrl?: string | null;
  existingTrackingNumber?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [labelUrl, setLabelUrl] = useState(existingLabelUrl);
  const [trackingNumber, setTrackingNumber] = useState(existingTrackingNumber);
  const [error, setError] = useState("");

  async function handleGenerateLabel() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/generate-label`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not generate label.");
        return;
      }

      setLabelUrl(data.labelUrl);
      setTrackingNumber(data.trackingNumber);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (labelUrl) {
    return (
      <div className="space-y-2">
        {trackingNumber && (
          <p className="text-sm">Tracking: {trackingNumber}</p>
        )}

        <a
          href={labelUrl}
          target="_blank"
          className="inline-block bg-black text-white px-4 py-2 rounded-lg"
        >
          Download Label
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerateLabel}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Label"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
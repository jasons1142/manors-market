"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await fetch("/api/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Verification failed.");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#3d251e]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#DCC7A6] border rounded-xl p-6 space-y-4 text-black"
      >
        <h1 className="text-2xl font-bold text-[#3d251e]">
          Verify Your Email
        </h1>

        <p className="text-sm text-gray-600">
          Enter the verification code sent to your email.
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="6-digit code"
          className="w-full border rounded-lg p-3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-[#3d251e] text-white rounded-lg p-3 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </main>
  );
}
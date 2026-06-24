"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch(
      "/api/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(
        data.error ||
          "Something went wrong."
      );
      setLoading(false);
      return;
    }

    setMessage(data.message);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#3d251e]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#DCC7A6] border rounded-xl p-6 space-y-4 text-black"
      >
        <h1 className="text-2xl font-bold text-black">
          Forgot Password
        </h1>

        <p className="text-sm text-black">
          Enter your email and we'll
          send you a password reset
          link.
        </p>

        {message && (
          <p className="text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <button
          disabled={loading}
          className="w-full bg-[#3d251e] text-white rounded-lg p-3 disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>
    </main>
  );
}
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between p-4 border-b bg-[#DCC7A1]">
      {/* Left Side - Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-4 py-2 rounded-lg text-amber-800 text-4xl"
        >
          ☰
        </button>

        {open && (
          <div className="absolute left-0 mt-2 w-48 bg-amber-600 border rounded-lg shadow-lg p-3 flex flex-col gap-3 z-50 text-green-800 text-2xl">
            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>

            {session && (
              <>
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                >
                  My Orders
                </Link>

                <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart
                </Link>
              </>
            )}

            {session?.user?.role === "ADMIN" && (
              <>
                <Link
                  href="/dashboard/products"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/orders"
                  onClick={() => setOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}

            {!session && (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>

                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Center - Brand */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 font-bold text-4xl text-green-800"
      >
        Manor&apos;s Market
      </Link>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <p className="text-sm text-amber-800">
              {session.user.email}
            </p>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border px-3 py-1 rounded text-amber-800"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart
            </Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
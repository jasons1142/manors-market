"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-4 py-3 border-b bg-[#DCC7A6] min-h-24">
      {/* Left Side - Menu */}
      <div className="relative z-20">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-3 py-2 rounded-lg text-[#3d251e] text-4xl md:text-6xl"
        >
          ☰
        </button>

        {open && (
          <div className="absolute left-0 mt-2 w-48 bg-[#DCC7A6] border border-[#3d251e]/30 rounded-lg shadow-lg p-3 flex flex-col gap-3 z-50 text-[#3d251e] text-xl md:text-2xl">
            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>

            {session && (
              <Link href="/account/orders" onClick={() => setOpen(false)}>
                My Orders
              </Link>
            )}

            {session?.user?.role === "ADMIN" && (
              <>
                <Link href="/dashboard/products" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>

                <Link href="/dashboard/orders" onClick={() => setOpen(false)}>
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
        className="absolute left-1/2 -translate-x-1/2 z-10"
      >
        <img
          src="/logo.png"
          alt="Manor's Market"
          className="h-16 w-auto md:h-24"
        />
      </Link>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-2 md:gap-4 z-20 text-[#3d251e]">
        {session ? (
          <>
            <p className="hidden md:block text-sm max-w-[180px] truncate">
              {session.user.email}
            </p>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="text-sm md:text-base"
            >
              Cart
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border border-[#3d251e]/40 px-2 md:px-3 py-1 rounded text-sm md:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2 md:gap-3 text-[#3d251e] text-sm md:text-xl">
            <Link href="/cart" onClick={() => setOpen(false)}>
              Cart
            </Link>
            <Link href="/login">Login</Link>
            <Link className="hidden sm:inline" href="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
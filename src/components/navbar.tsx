"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-xl">
        Manor&apos;s Market
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/products">Products</Link>

        {session?.user?.role === "ADMIN" && (
            <>
                <Link href="/dashboard/products">Dashboard</Link>
                <Link href="/dashboard/orders">Orders</Link>
            </>
        )}

        {!session ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <p>{session.user.email}</p>
            <Link href="/cart">Cart</Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
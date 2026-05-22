"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-xl">
        Manor's Market
      </Link>

      <div className="flex gap-4 items-center">
        {!session ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <p>{session.user.email}</p>

            <button
              onClick={() => signOut()}
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
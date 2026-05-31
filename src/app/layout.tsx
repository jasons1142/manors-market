import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
            <Navbar />
            <CartProvider>
                {children}
            </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
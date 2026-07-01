import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SpeedInsights />
        <Analytics />
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
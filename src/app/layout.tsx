import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import Navbar from "@/components/navbar";

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
            {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
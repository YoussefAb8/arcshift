import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Arc USDC | Unified Balance",
  description: "Testnet USDC transfers built on Arc and Circle Gateway",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-ink text-paper min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

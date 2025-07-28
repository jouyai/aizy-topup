import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aizy Topup",
  description: "Top up game murah dan terpercaya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} dark`} suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
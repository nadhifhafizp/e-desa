import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Pastikan path ini benar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Desa Digital",
  description: "Portal Resmi Informasi Desa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Navbar dipasang di sini agar permanen di semua halaman */}
        <Navbar /> 
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Pastikan path ini benar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Desa Sukalaksana Bekasi',
  description: 'Website resmi Desa Sukalaksana...',
  verification: {
    google: 'mamlGGnWoAvDXnS3wnBkvek6EYJWndzCPZT0d1n0bUc',
  },
} as Metadata;

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



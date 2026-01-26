import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Pastikan path ini benar

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: 'Desa Sukalaksana Bekasi', // Sesuaikan dengan judulmu
  description: 'Website resmi Desa Sukalaksana...',
  // Tambahkan bagian ini:
  verification: {
    google: 'PASTE_KODE_ACAK_DARI_GOOGLE_DI_SINI',
  },
}

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



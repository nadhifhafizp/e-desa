import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hapus blok eslint dari sini
  
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
      {
        protocol: 'https',
        hostname: 'mgrjupkesziogdysqbdi.supabase.co', 
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
};

export default nextConfig;
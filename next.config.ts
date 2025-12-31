import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Matikan unoptimized jika kamu sudah deploy production, 
    // tapi saat dev/local kadang perlu true jika internet memblokir ipv6
    unoptimized: true, 
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Izin untuk gambar Hero
      },
      {
        protocol: 'https',
        // Ganti dengan hostname supabase project kamu (cek di dashboard supabase)
        // Biasanya formatnya: xxxxxxxxx.supabase.co
        hostname: 'mgrjupkesziogdysqbdi.supabase.co', 
      },
    ],
  },
};

export default nextConfig;
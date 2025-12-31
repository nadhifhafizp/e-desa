import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import BelanjaView from '@/components/BelanjaView'; // Import komponen baru

// Revalidate 0 agar fetch awal selalu fresh
export const revalidate = 0;

export default async function BelanjaPage() {
  // Fetch Data Awal di Server
  const { data: products } = await supabase
    .from('marketplace_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <span className="inline-block py-1 px-3 rounded-full bg-green-800 text-green-200 text-sm font-semibold mb-4 border border-green-700">
              UMKM Desa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Pasar Digital Desa</h1>
            <p className="text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
              Dukung ekonomi lokal dengan membeli produk asli buatan warga Desa Sukalaksana.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* RENDER CLIENT VIEW (Search + Realtime berjalan di sini) */}
      <BelanjaView initialProducts={products || []} />

    </main>
  );
}
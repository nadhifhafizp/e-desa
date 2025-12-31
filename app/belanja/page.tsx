import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, MessageCircle, Tag, Search, Store } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

// Agar data produk selalu fresh (Real-time update stok/harga)
export const revalidate = 0;

export default async function BelanjaPage() {
  // Ambil data produk dari database
  const { data: products } = await supabase
    .from('marketplace_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HERO SECTION (Konsisten dengan halaman lain) */}
      <section className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <span className="inline-block py-1 px-3 rounded-full bg-green-800 text-green-200 text-sm font-semibold mb-4 border border-green-700">
              UMKM Desa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Pasar Digital Desa</h1>
            <p className="text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
              Dukung ekonomi lokal dengan membeli produk asli buatan warga Desa Sukalaksana. 
              Segar, berkualitas, dan terjangkau.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. MAIN CONTENT (Overlap ke atas -mt-16) */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        
        {/* Filter / Search Bar (Visual Only) */}
        <FadeIn delay={0.1}>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cari jajanan, kerajinan..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full no-scrollbar">
                    {['Semua', 'Makanan', 'Kerajinan', 'Jasa', 'Pertanian'].map((cat, idx) => (
                        <button key={idx} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${idx === 0 ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </FadeIn>

        {/* 3. GRID PRODUK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.1}>
              <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden">
                
                {/* Gambar Produk */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image 
                        src={item.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070'} 
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    {/* Badge Kategori */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                        <Tag size={12} /> {item.category}
                    </div>
                    {/* Badge Stok */}
                    {!item.is_available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                            STOK HABIS
                        </div>
                    )}
                </div>

                {/* Detail Produk */}
                <div className="p-5 flex flex-col grow">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-green-700 transition">
                        {item.name}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 grow">
                        {item.description || 'Tidak ada deskripsi.'}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Harga</p>
                            <p className="text-lg font-bold text-green-600">
                                Rp {item.price.toLocaleString('id-ID')}
                            </p>
                        </div>
                        
                        {/* Tombol Beli WA */}
                        <a 
                            href={
                                item.is_available 
                                ? `https://wa.me/${item.contact_number}?text=Halo, saya tertarik membeli produk "${item.name}" yang ada di Website Desa.` 
                                : '#'
                            }
                            target="_blank"
                            className={`p-3 rounded-xl transition shadow-lg ${
                                item.is_available 
                                ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                            title={item.is_available ? "Beli via WhatsApp" : "Stok Habis"}
                        >
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

        {/* Empty State (Jika Kosong) */}
        {products?.length === 0 && (
            <FadeIn>
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Belum ada produk</h3>
                    <p className="text-slate-500">Produk UMKM akan segera hadir di sini.</p>
                </div>
            </FadeIn>
        )}

        {/* 4. CTA DAFTAR UMKM */}
        <FadeIn delay={0.4}>
            <div className="mt-20 bg-linear-to-r from-green-800 to-emerald-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                {/* Dekorasi */}
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Store size={200} />
                </div>
                
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-3xl font-bold mb-4">Punya Usaha di Desa?</h2>
                    <p className="text-green-100 text-lg leading-relaxed">
                        Ayo promosikan produk Anda secara GRATIS di website desa. 
                        Jangkau lebih banyak pembeli dan majukan ekonomi keluarga.
                    </p>
                </div>
                
                <div className="relative z-10 shrink-0">
                    <a 
                        href="https://wa.me/628123456789" // Ganti Nomor Admin
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <Store size={20} /> Daftar Sekarang
                    </a>
                </div>
            </div>
        </FadeIn>

      </div>
    </main>
  );
}
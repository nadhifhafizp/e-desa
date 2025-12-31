'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, Tag, Search, Store, Loader2 } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function BelanjaView({ initialProducts }: { initialProducts: any[] }) {
  // 1. STATE MANAGEMENT
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [isAnimating, setIsAnimating] = useState(false); // Efek visual saat filter

  // 2. REALTIME SUBSCRIPTION (Agar update tanpa refresh)
  useEffect(() => {
    const channel = supabase
      .channel('realtime-belanja')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'marketplace_items' },
        (payload) => {
          // Logika update state otomatis
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) => 
              prev.map((item) => item.id === payload.new.id ? payload.new : item)
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. LOGIKA FILTER & PENCARIAN
  const filteredProducts = products.filter((item) => {
    const matchCategory = category === 'Semua' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Handler Ganti Kategori dengan animasi
  const handleCategoryChange = (cat: string) => {
    if (cat === category) return;
    setIsAnimating(true);
    setCategory(cat);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        
        {/* FILTER & SEARCH BAR */}
        <FadeIn delay={0.1}>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-4">
                {/* Input Pencarian */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari jajanan, kerajinan..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                </div>
                
                {/* Tombol Kategori */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full no-scrollbar">
                    {['Semua', 'Makanan', 'Kerajinan', 'Jasa', 'Pertanian', 'Fashion'].map((cat, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                                category === cat 
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </FadeIn>

        {/* GRID PRODUK */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          {filteredProducts.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden">
                
                {/* Gambar */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image 
                        src={item.image_url || 'https://via.placeholder.com/400?text=Produk+Desa'} 
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                        <Tag size={12} /> {item.category}
                    </div>
                    {!item.is_available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                            STOK HABIS
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-green-700 transition">
                        {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                        {item.description || 'Tidak ada deskripsi.'}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Harga</p>
                            <p className="text-lg font-bold text-green-600">
                                Rp {item.price?.toLocaleString('id-ID')}
                            </p>
                        </div>
                        
                        {/* Tombol WA */}
                        <a 
                            href={item.is_available ? `https://wa.me/${item.contact_number}?text=Halo, saya tertarik produk "${item.name}"` : '#'}
                            target="_blank"
                            className={`p-3 rounded-xl transition shadow-lg ${
                                item.is_available 
                                ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Produk tidak ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci lain atau ubah kategori.</p>
            </div>
        )}

        {/* CTA BANNER */}
        <FadeIn delay={0.4}>
            <div className="mt-20 bg-gradient-to-r from-green-800 to-emerald-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Store size={200} />
                </div>
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-3xl font-bold mb-4">Punya Usaha di Desa?</h2>
                    <p className="text-green-100 text-lg leading-relaxed">
                        Ayo promosikan produk Anda secara GRATIS di website desa.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <a href="https://wa.me/628123456789" target="_blank" className="inline-flex items-center gap-2 bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <Store size={20} /> Daftar Sekarang
                    </a>
                </div>
            </div>
        </FadeIn>

    </div>
  );
}
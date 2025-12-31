import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn'; // Component animasi yang kita buat tadi
import Footer from '@/components/Footer';
import { ArrowRight, ShoppingBag } from 'lucide-react';

// Refresh data setiap 60 detik (ISR)
export const revalidate = 60;

async function getData() {
  // Ambil data Sambutan
  const sambutanReq = supabase.from('page_contents').select('*').eq('section_key', 'sambutan_kades').single();
  // Ambil 3 Berita Terbaru
  const newsReq = supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3);
  // Ambil 4 Produk UMKM Terbaru
  const umkmReq = supabase.from('marketplace_items').select('*').eq('is_available', true).limit(4);

  const [sambutan, news, umkm] = await Promise.all([sambutanReq, newsReq, umkmReq]);

  return {
    sambutan: sambutan.data,
    news: news.data || [],
    umkm: umkm.data || []
  };
}

export default async function Home() {
  const { sambutan, news, umkm } = await getData();

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-150 flex items-center justify-center overflow-hidden">
        {/* Background Image Fixed */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" 
            alt="Pemandangan Desa" 
            fill 
            className="object-cover brightness-[0.6]" // Gelapkan gambar agar teks terbaca
            priority
          />
        </div>

        {/* Content Hero dengan Animasi */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <FadeIn>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
              Selamat Datang di <br/> <span className="text-green-400">Desa Digital</span>
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-slate-200 max-w-2xl mx-auto drop-shadow-md">
              Mewujudkan pelayanan publik yang transparan, akuntabel, dan inovatif untuk masyarakat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profil" className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full font-semibold transition shadow-lg hover:scale-105 transform duration-200">
                Profil Desa
              </Link>
              <Link href="/layanan" className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 rounded-full font-semibold transition shadow-lg">
                Layanan Surat
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* 2. SAMBUTAN KEPALA DESA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/3 relative">
                <div className="absolute -inset-4 bg-green-100 rounded-xl -z-10 rotate-3"></div>
                <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-2xl">
                  <Image 
                  src="/images/kades.jpg" 
                  alt="Kepala Desa"
                  fill
                  className="object-cover"
                />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2 block">Sambutan Kepala Desa</span>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">{sambutan?.title || 'Menuju Desa Mandiri'}</h2>
                <div className="prose prose-lg text-slate-600 mb-6">
                  <p>{sambutan?.content || 'Assalamualaikum Wr. Wb. Selamat datang di website resmi desa kami...'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Bapak Kepala Desa</p>
                    <p className="text-slate-500 text-sm">Kepala Desa Periode 2024-2029</p>
                  </div>
                  {/* Tanda tangan (opsional) */}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* 3. BERITA TERKINI */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-green-600 font-bold uppercase text-sm">Informasi Terbaru</span>
                <h2 className="text-3xl font-bold text-slate-800 mt-2">Kabar Desa</h2>
              </div>
              <Link href="/berita" className="hidden md:flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                Lihat Semua Berita <ArrowRight size={20} />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.1}> {/* Animasi berurutan (staggered) */}
                <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image 
                      src={item.image_url || '/placeholder-news.jpg'} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                      {new Date(item.published_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-600 transition">
                      <Link href={`/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 grow">
                      {item.content}
                    </p>
                    <Link href={`/berita/${item.slug}`} className="text-green-600 font-semibold text-sm hover:underline mt-auto">
                      Baca Selengkapnya
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
             <Link href="/berita" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm">
                Lihat Semua Berita <ArrowRight size={18} />
             </Link>
          </div>
        </div>
      </section>


      {/* 4. PRODUK UMKM */}
      <section className="py-20 bg-green-900 text-white relative overflow-hidden">
        {/* Dekorasi Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Produk Unggulan Desa</h2>
              <p className="text-green-200 max-w-2xl mx-auto">
                Dukung perekonomian lokal dengan membeli produk asli buatan warga desa kami.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {umkm.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.1}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:-translate-y-2 transition duration-300">
                  <div className="relative h-48 bg-slate-200">
                    <Image 
                      src={product.image_url || '/placeholder-product.jpg'} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                    {/* Badge Kategori */}
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{product.name}</h3>
                    <p className="text-green-600 font-bold mb-3">
                      {product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi Penjual'}
                    </p>
                    <Link href="/belanja" className="w-full block text-center bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 py-2 rounded-lg text-sm font-semibold transition">
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingBag size={16} /> Lihat Detail
                      </span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-12">
              <Link href="/belanja" className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-green-900 transition duration-300">
                Jelajahi Semua Produk
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />

    </main>
  );
}
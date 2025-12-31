import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Calendar, User, ArrowRight } from 'lucide-react';

// Agar halaman ini dinamis (tidak di-cache statis) karena ada fitur search
export const dynamic = 'force-dynamic';

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';

  // Query Database
  let request = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // Jika ada search query, filter berdasarkan judul
  if (query) {
    request = request.ilike('title', `%${query}%`);
  }

  const { data: news } = await request;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-10">
      
      {/* HEADER */}
      <div className="container mx-auto px-4 text-center">
        <FadeIn>
          <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Kabar Desa</span>
          <h1 className="text-4xl font-bold text-slate-800 mt-2 mb-6">Berita & Kegiatan</h1>
          
          {/* SEARCH BAR */}
          <SearchBar />
        </FadeIn>
      </div>

      <div className="container mx-auto px-4">
        
        {/* LIST BERITA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.05}>
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition duration-300 flex flex-col h-full group">
                
                {/* Gambar Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <Image 
                    src={item.image_url || '/placeholder-news.jpg'} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  {/* Badge Tanggal */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2">
                    <Calendar size={14} className="text-green-600"/>
                    {new Date(item.published_at).toLocaleDateString('id-ID')}
                  </div>
                </div>

                {/* Konten */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <User size={14} /> 
                    <span>{item.author_name || 'Admin'}</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-700 transition">
                    <Link href={`/berita/${item.slug}`}>
                        {item.title}
                    </Link>
                  </h2>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 grow leading-relaxed">
                    {item.content}
                  </p>

                  <Link 
                    href={`/berita/${item.slug}`} 
                    className="inline-flex items-center gap-2 text-green-600 font-bold text-sm hover:gap-3 transition-all mt-auto"
                  >
                    Baca Selengkapnya <ArrowRight size={16} />
                  </Link>
                </div>

              </article>
            </FadeIn>
          ))}
        </div>

        {/* STATE KOSONG (Jika search tidak ketemu) */}
        {news?.length === 0 && (
          <FadeIn>
            <div className="text-center py-20">
              <div className="bg-slate-100 inline-block p-6 rounded-full mb-4">
                <Calendar size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Tidak ada berita ditemukan</h3>
              <p className="text-slate-500 mt-2">Coba cari dengan kata kunci lain.</p>
            </div>
          </FadeIn>
        )}

      </div>

      <div className="h-20"></div>
      <Footer />
    </main>
  );
}
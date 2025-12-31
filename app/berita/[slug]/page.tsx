import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const { data: news } = await supabase.from('news').select('slug');
  return news?.map((item) => ({ slug: item.slug })) || [];
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!news) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION (Sticky & Parallax) */}
      {/* Kita pakai 'z-0' (bukan -z-10) supaya gambar TETAP MUNCUL tapi ada di belakang */}
      <div className="sticky top-0 h-[75vh] w-full z-0">
         <Image 
            src={news.image_url || '/placeholder-news.jpg'}
            alt={news.title}
            fill
            className="object-cover"
            priority
         />
         {/* Overlay Gradasi agar teks terbaca */}
         <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-black/80"></div>
         
         {/* Judul & Info di tengah Hero */}
         <div className="absolute inset-0 flex flex-col justify-end pb-24 container mx-auto px-4 text-white z-20">
            <Link href="/berita" className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-white mb-6 transition w-fit bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <ArrowLeft size={16}/> Kembali ke Daftar Berita
            </Link>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl drop-shadow-lg">
                {news.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm md:text-base text-slate-200">
                <span className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Calendar size={18} className="text-green-400"/>
                    {new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <User size={18} className="text-green-400"/>
                    {news.author_name || 'Admin Desa'}
                </span>
            </div>
         </div>
      </div>

      {/* 2. KONTEN BERITA */}
      {/* Kita pakai 'relative z-10' supaya kertas putih ini naik MENUTUPI gambar */}
      <div className="relative z-10 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-12 pt-16 pb-10 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-4xl">
            
            {/* STYLE TEKS REQUEST ANDA (Drop Cap / Huruf Awal Besar) */}
            <article className="prose prose-lg prose-slate mx-auto first-letter:text-5xl first-letter:font-bold first-letter:text-green-600 first-letter:float-left first-letter:mr-3">
            {news.content.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() === '' 
                ? <br key={index} />
                : <p key={index} className="mb-6 leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
            ))}
            </article>

        </div>

        <div className="mt-20 border-t pt-10">
            <Footer />
        </div>
      </div>

    </main>
  );
}
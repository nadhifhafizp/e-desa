import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, PenSquare, Calendar } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton'; // Gunakan komponen delete yg sudah ada

export const revalidate = 0;

export default async function AdminBeritaPage() {
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Berita</h1>
            <p className="text-slate-500 text-sm">Kelola artikel dan informasi desa.</p>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
        >
          <Plus size={20} /> Tulis Berita
        </Link>
      </div>

      <div className="space-y-4">
        {news?.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-start">
            
            {/* Foto Thumbnail */}
            <div className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
              <Image 
                src={item.image_url || '/placeholder-news.jpg'} 
                alt={item.title} 
                fill 
                className="object-cover"
              />
            </div>

            {/* Info Berita */}
            <div className="grow min-w-0">
              <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{item.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                 <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(item.published_at).toLocaleDateString('id-ID')}</span>
                 <span className={`px-2 py-0.5 rounded text-xs ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                 </span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2">{item.content}</p>
            </div>

            {/* Aksi */}
            <div className="flex flex-col gap-2">
               <Link 
                 href={`/admin/berita/edit/${item.id}`}
                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                 title="Edit Berita"
               >
                 <PenSquare size={20} />
               </Link>
               <DeleteButton id={item.id} table="news" />
            </div>

          </div>
        ))}
        
        {news?.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
             Belum ada berita yang ditulis.
          </div>
        )}
      </div>
    </div>
  );
}
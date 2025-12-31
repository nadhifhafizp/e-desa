import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Users, FileText, ShoppingBag, Newspaper, 
  ArrowRight, BellRing, CheckCircle 
} from 'lucide-react';

// Revalidate 0 agar data selalu fresh
export const revalidate = 0;

export default async function AdminDashboard() {
  
  // Fetch Ringkasan Data secara Paralel dengan penanganan hasil yang lebih aman
  const [
    resSurat,
    resBerita,
    resUmkm,
    resPenduduk
  ] = await Promise.all([
    supabase.from('letter_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('marketplace_items').select('*', { count: 'exact', head: true }),
    supabase.from('demographic_stats').select('*')
  ]);

  // Ambil nilai count/data dengan fallback aman (mencegah error null/undefined)
  const suratPending = resSurat.count || 0;
  const totalBerita = resBerita.count || 0;
  const totalUmkm = resUmkm.count || 0;
  const pendudukData = resPenduduk.data || [];

  // Hitung total penduduk dari data statistik
  const totalPenduduk = pendudukData
    .filter((p: any) => p.category === 'gender')
    .reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

  return (
    <div className="p-8">
      
      {/* Header Sapaan */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, Admin! 👋</h1>
        <p className="text-slate-500 mt-1">Berikut adalah ringkasan aktivitas di Desa Digital hari ini.</p>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card Surat (Pending) */}
        <Link href="/admin/layanan" className="group">
           <div className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${suratPending > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-xl ${suratPending > 0 ? 'bg-red-100 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {suratPending > 0 ? <BellRing size={24} className="animate-pulse"/> : <CheckCircle size={24}/>}
                 </div>
                 <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-lg">Layanan</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{suratPending}</h3>
              <p className={`text-sm font-medium ${suratPending > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                {suratPending > 0 ? 'Perlu Diproses!' : 'Semua Beres'}
              </p>
           </div>
        </Link>

        {/* Card Penduduk */}
        <Link href="/admin/penduduk" className="group">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users size={24} />
                 </div>
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Warga</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{totalPenduduk.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-slate-500">Total Penduduk</p>
           </div>
        </Link>

        {/* Card Berita */}
        <Link href="/admin/berita" className="group">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Newspaper size={24} />
                 </div>
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Artikel</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{totalBerita}</h3>
              <p className="text-sm text-slate-500">Berita Terpublikasi</p>
           </div>
        </Link>

        {/* Card UMKM */}
        <Link href="/admin/produk" className="group">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <ShoppingBag size={24} />
                 </div>
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Pasar</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{totalUmkm}</h3>
              <p className="text-sm text-slate-500">Produk UMKM</p>
           </div>
        </Link>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* PERBAIKAN DI SINI: bg-gradient-to-br */}
         <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-2">Tulis Berita Baru?</h3>
               <p className="text-green-200 mb-6 max-w-xs">Bagikan informasi kegiatan atau pengumuman terbaru kepada warga.</p>
               <Link href="/admin/berita/tambah" className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">
                  Buat Artikel <ArrowRight size={18} />
               </Link>
            </div>
            {/* Dekorasi */}
            <Newspaper className="absolute -bottom-6 -right-6 text-white opacity-10" size={180} />
         </div>

         <div className="bg-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Kelola Permohonan</h3>
             <p className="text-slate-500 mb-6 max-w-xs">Cek surat-surat yang diajukan warga hari ini.</p>
             <Link href="/admin/layanan" className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
                  Lihat Inbox <ArrowRight size={18} />
             </Link>
             <BellRing className="absolute -bottom-6 -right-6 text-slate-200 opacity-50" size={150} />
         </div>
      </div>

    </div>
  );
}
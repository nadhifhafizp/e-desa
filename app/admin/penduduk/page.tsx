import { supabase } from '@/lib/supabase';
import { Users, Map, Home, Zap, Briefcase, GraduationCap } from 'lucide-react';
import EditStatButton from '@/components/admin/EditStatButton';

export const revalidate = 0;

export default async function AdminPendudukPage() {
  // Ambil semua data statistik
  const { data: stats } = await supabase
    .from('demographic_stats')
    .select('*')
    .order('value', { ascending: false }); // Urutkan dari terbesar (opsional)

  // Helper function untuk memfilter data berdasarkan kategori
  const getByCategory = (cat: string) => stats?.filter(s => s.category === cat) || [];

  // Komponen Card per Seksi
  const StatSection = ({ title, icon: Icon, category, color, bgColor }: any) => {
    const data = getByCategory(category);
    
    // Jika data kosong, tidak perlu ditampilkan
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 ${color}`}>
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon size={24} className="text-current" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition group">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1 group-hover:text-slate-700 transition">{item.label}</p>
                <p className="text-2xl font-bold text-slate-800 flex items-end gap-1">
                  {item.value.toLocaleString('id-ID')}
                  {/* Satuan kecil otomatis berdasarkan label */}
                  <span className="text-xs text-slate-400 font-normal mb-1">
                    {item.label.toLowerCase().includes('luas') ? 'km²' : 
                     item.label.toLowerCase().includes('keluarga') ? 'KK' : 
                     item.label.toLowerCase().includes('rukun') ? '' : 'Unit/Jiwa'}
                  </span>
                </p>
              </div>
              <EditStatButton item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Data Statistik Desa</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola angka statistik untuk ditampilkan di Info Grafis Publik.</p>
         </div>
         {/* Di sini nanti bisa tambah tombol "Reset Data" atau "Tambah Manual" jika perlu */}
      </div>
      
      {/* 1. DATA KEPENDUDUKAN (GENDER) */}
      <StatSection 
        title="Kependudukan (Gender)" 
        icon={Users} 
        category="gender" 
        color="text-blue-600" 
        bgColor="bg-blue-50"
      />

      {/* 2. WILAYAH & ADMINISTRASI (RW/RT/LUAS) */}
      <StatSection 
        title="Wilayah & Administrasi" 
        icon={Map} 
        category="wilayah" 
        color="text-emerald-600" 
        bgColor="bg-emerald-50"
      />

      {/* 3. SARANA & PRASARANA (MASJID/SEKOLAH) */}
      <StatSection 
        title="Sarana & Prasarana" 
        icon={Home} 
        category="sarana" 
        color="text-orange-600" 
        bgColor="bg-orange-50"
      />

      {/* 4. EKONOMI & KESEJAHTERAAN (PLN/DTKS) */}
      <StatSection 
        title="Ekonomi & Kesejahteraan" 
        icon={Zap} 
        category="ekonomi" 
        color="text-purple-600" 
        bgColor="bg-purple-50"
      />
      
      {/* 5. PEKERJAAN (Jika ada datanya) */}
      <StatSection 
        title="Profesi & Pekerjaan" 
        icon={Briefcase} 
        category="pekerjaan" 
        color="text-slate-600" 
        bgColor="bg-slate-100"
      />

    </div>
  );
}
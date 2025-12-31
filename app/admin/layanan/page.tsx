'use client'; // Ubah jadi Client Component untuk fitur Real-time

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import RequestActions from '@/components/admin/RequestActions';
import { Mail, Search, AlertCircle, Loader2, BellRing } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function AdminLayananPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 1. Fetch Data Awal
  const fetchRequests = async () => {
    const { data } = await supabase
      .from('letter_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setRequests(data);
    setLoading(false);
  };

  // 2. Setup Real-time Subscription
  useEffect(() => {
    fetchRequests();

    // Subscribe ke perubahan di tabel 'letter_requests'
    const channel = supabase
      .channel('admin-letters')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'letter_requests' },
        (payload) => {
          // Jika ada INSERT (Warga kirim surat baru)
          if (payload.eventType === 'INSERT') {
            setRequests((prev) => [payload.new, ...prev]);
            // Opsional: Bunyikan notifikasi atau alert visual
            alert('🔔 Ada permohonan surat baru masuk!');
          }
          // Jika ada UPDATE (Admin ubah status)
          else if (payload.eventType === 'UPDATE') {
            setRequests((prev) => 
              prev.map((item) => item.id === payload.new.id ? payload.new : item)
            );
          }
        // 3. BARU: DELETE (Hapus Data)
            else if (payload.eventType === 'DELETE') {
                // Hapus item dari state lokal berdasarkan ID yang dihapus
                setRequests((prev) => prev.filter((item) => item.id !== payload.old.id));
            }
            }
        )
        .subscribe();
        
    // Cleanup saat pindah halaman
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter pencarian
  const filteredRequests = requests.filter(req => 
    req.full_name.toLowerCase().includes(search.toLowerCase()) ||
    req.nik.includes(search)
  );

  return (
    <div className="p-6 min-h-screen pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Mail className="text-green-600" /> Permohonan Surat
           </h1>
           <p className="text-slate-500 text-sm mt-1">
             Pantau pengajuan surat warga secara real-time.
           </p>
        </div>
        
        {/* Search Bar */}
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm w-full md:w-80 focus-within:ring-2 ring-green-500 transition">
           <Search size={20} className="text-slate-400" />
           <input 
             type="text"
             placeholder="Cari nama atau NIK..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
           />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
         <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-green-600" size={40} />
         </div>
      )}

      {/* Tabel Data */}
      {!loading && (
        <FadeIn>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Waktu Masuk</th>
                    <th className="px-6 py-4">Pemohon</th>
                    <th className="px-6 py-4">Jenis Surat</th>
                    <th className="px-6 py-4">Keterangan</th>
                    <th className="px-6 py-4 min-w-50">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition group">
                      
                      {/* Waktu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 font-medium">
                            {new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {new Date(req.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })}
                          </span>
                        </div>
                        {/* Indikator Baru (Jika status Pending) */}
                        {req.status === 'Pending' && (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1 animate-pulse">
                            <BellRing size={10} /> BARU
                          </span>
                        )}
                      </td>

                      {/* Info Warga */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-base">{req.full_name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">NIK: {req.nik}</p>
                        <div className="flex items-center gap-1 text-xs text-green-700 mt-2 font-medium">
                          <Mail size={12} /> {req.whatsapp}
                        </div>
                      </td>

                      {/* Jenis Surat */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                          req.letter_type.includes('SKTM') ? 'bg-pink-50 text-pink-700 border-pink-100' :
                          req.letter_type.includes('Usaha') ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {req.letter_type}
                        </span>
                      </td>

                      {/* Keterangan */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2 italic text-xs">
                          "{req.reason || '-'}"
                        </p>
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4">
                        <RequestActions request={req} />
                      </td>

                    </tr>
                  ))}

                  {/* Empty State */}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-full">
                              <AlertCircle size={40} className="opacity-20" />
                            </div>
                            <p>Tidak ada permohonan yang ditemukan.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
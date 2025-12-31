'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
// Tambahkan Trash2
import { MessageCircle, CheckCircle, XCircle, Clock, Loader2, FileText, Trash2 } from 'lucide-react';

export default function RequestActions({ request }: { request: any }) {
  const [loading, setLoading] = useState(false);

  // Fungsi Update Status
  const updateStatus = async (newStatus: string) => {
    /* ... kode updateStatus yang lama ... */
    // (Boleh dicopy dari sebelumnya, tidak berubah)
    if (!confirm(`Ubah status menjadi "${newStatus}"?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('letter_requests').update({ status: newStatus }).eq('id', request.id);
      if (error) throw error;
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // BARU: Fungsi Hapus Permanen
  const handleDelete = async () => {
    if (!confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin MENGHAPUS data ini secara permanen? Data yang dihapus tidak bisa dikembalikan.')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('letter_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;
      // Tidak perlu router.refresh() karena kita pakai Real-time di parent
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper Warna Badge
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      case 'Ditolak': return 'bg-red-100 text-red-700 border-red-200';
      case 'Diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getWaLink = () => {
    return `https://wa.me/${request.whatsapp}`;
  };

  return (
    <div className="flex flex-col gap-3">
      
      {/* Badge Status */}
      <div className={`px-3 py-1 rounded-full text-xs font-bold border w-fit flex items-center gap-1 ${getStatusColor(request.status)}`}>
        {request.status === 'Pending' && <Clock size={12}/>}
        {request.status === 'Selesai' && <CheckCircle size={12}/>}
        {request.status === 'Ditolak' && <XCircle size={12}/>}
        {request.status}
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
            <Loader2 className="animate-spin text-slate-400" size={18} />
        ) : (
            <>
                {/* Tombol Flow Status (Pending -> Diproses -> Selesai) */}
                {request.status === 'Pending' && (
                    <button onClick={() => updateStatus('Diproses')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Proses">
                        <FileText size={18} />
                    </button>
                )}
                {request.status === 'Diproses' && (
                    <button onClick={() => updateStatus('Selesai')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition" title="Selesai">
                        <CheckCircle size={18} />
                    </button>
                )}

                {/* Tombol Tolak */}
                {request.status !== 'Selesai' && request.status !== 'Ditolak' && (
                    <button onClick={() => updateStatus('Ditolak')} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition" title="Tolak">
                        <XCircle size={18} />
                    </button>
                )}

                {/* BARU: Tombol Hapus (Merah) */}
                <button 
                    onClick={handleDelete}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    title="Hapus Permanen"
                >
                    <Trash2 size={18} />
                </button>
            </>
        )}

        {/* Tombol WA */}
        <a href={getWaLink()} target="_blank" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition ml-auto">
            <MessageCircle size={18} />
        </a>
      </div>

    </div>
  );
}
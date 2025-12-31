'use client';

import { PenSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Definisikan tipe data agar lebih aman (optional tapi good practice)
interface StatItem {
  id: string;
  label: string;
  value: number;
}

export default function EditStatButton({ item }: { item: StatItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    // 1. Munculkan Popup bawaan browser untuk input angka
    // Default value-nya adalah angka saat ini
    const newValue = window.prompt(`Update data "${item.label}":`, item.value.toString());

    // 2. Jika user klik Cancel atau kosong, batalkan
    if (newValue === null || newValue.trim() === '') return;

    // 3. Validasi harus angka
    const numberValue = parseInt(newValue);
    if (isNaN(numberValue)) {
      alert("Error: Harap masukkan angka yang valid!");
      return;
    }

    setLoading(true);

    try {
      // 4. Update ke Database Supabase
      const { error } = await supabase
        .from('demographic_stats')
        .update({ value: numberValue })
        .eq('id', item.id);

      if (error) throw error;

      // 5. Refresh halaman admin agar angka berubah otomatis
      router.refresh();
      
    } catch (error: any) {
      alert('Gagal update: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEdit} 
      disabled={loading}
      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
      title="Edit Data"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin text-blue-600" />
      ) : (
        <PenSquare size={18} />
      )}
    </button>
  );
}
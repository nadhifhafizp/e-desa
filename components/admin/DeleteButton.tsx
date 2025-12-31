'use client';

import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id, table }: { id: string, table: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirm) return;

    setLoading(true);
    await supabase.from(table).delete().eq('id', id);
    setLoading(false);
    
    router.refresh(); // Refresh halaman agar data hilang dari tabel
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}
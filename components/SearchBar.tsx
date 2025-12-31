'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce'; // Opsional, tapi kita pakai cara manual simple aja

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get('q') || '');

  // Fungsi handle search
  const handleSearch = (term: string) => {
    setText(term);
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    // Update URL tanpa refresh halaman (misal: /berita?q=lomba)
    router.replace(`/berita?${params.toString()}`);
  };

  return (
    <div className="relative max-w-md mx-auto mb-12">
      <input
        type="text"
        placeholder="Cari berita atau kegiatan..."
        className="w-full pl-12 pr-4 py-3 rounded-full border text-emerald-800 border-slate-200 shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
        value={text}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
    </div>
  );
}
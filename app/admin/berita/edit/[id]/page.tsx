'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  // State Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Ambil Data Lama
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
      if (error) {
        alert('Berita tidak ditemukan!');
        router.push('/admin/berita');
      } else {
        setTitle(data.title);
        setContent(data.content);
        setCurrentImageUrl(data.image_url);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // Handle Pilih Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Hapus Gambar Preview
  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setCurrentImageUrl(null);
  };

  // 2. Simpan Perubahan
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = currentImageUrl;

      // Upload gambar baru jika ada
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `berita-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      // Update Database
      const { error } = await supabase
        .from('news')
        .update({
            title,
            content,
            image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      alert('Berita berhasil diperbarui!');
      router.push('/admin/berita');
      router.refresh();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Memuat editor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/berita" className="p-2 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Edit Berita</h1>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
        
        {/* Judul */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Judul Berita</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition font-medium text-lg"
            placeholder="Masukkan judul berita..."
          />
        </div>

        {/* Gambar Sampul (Style Konsisten dengan Produk) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Gambar Sampul</label>
          
          {(previewUrl || currentImageUrl) ? (
             // Tampilan jika sudah ada gambar
             <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 group">
                <Image 
                  src={previewUrl || currentImageUrl || ''} 
                  alt="Preview" 
                  fill 
                  className="object-cover" 
                />
                {/* Tombol Hapus Gambar */}
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  title="Hapus Gambar"
                >
                  <Trash2 size={16} />
                </button>
                {/* Overlay Ganti */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white font-medium z-0 pointer-events-none">
                   Klik tombol hapus untuk mengganti
                </div>
             </div>
          ) : (
             // Tampilan Upload Area
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center text-slate-400 group-hover:text-green-600 transition">
                   <div className="p-4 bg-slate-100 rounded-full mb-3 group-hover:bg-green-50">
                      <ImageIcon size={32} />
                   </div>
                   <p className="font-medium text-sm">Klik untuk upload gambar sampul</p>
                   <p className="text-xs mt-1 text-slate-400">Format: JPG, PNG (Max 2MB)</p>
                </div>
             </div>
          )}
        </div>

        {/* Konten Berita */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Isi Berita</label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition leading-relaxed resize-y"
            placeholder="Tulis isi berita di sini..."
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20 disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AddNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Logic Generate Slug (URL) dari Judul
  // Contoh: "Lomba Makan Kerupuk" -> "lomba-makan-kerupuk"
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  // Logic Upload Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Preview sementara
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // 1. Upload Gambar ke Supabase Storage (Jika ada)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; // Nama file unik
        const { error: uploadError } = await supabase.storage
          .from('images') // Pastikan nama bucket sesuai langkah 0
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Ambil URL Publik
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // 2. Simpan Data ke Database
      const slug = generateSlug(title);
      const { error: dbError } = await supabase
        .from('news')
        .insert([
          {
            title,
            slug,
            content,
            image_url: imageUrl,
            is_published: true,
            published_at: new Date().toISOString(),
          }
        ]);

      if (dbError) throw dbError;

      // 3. Sukses! Kembali ke list
      alert('Berita berhasil ditambahkan!');
      router.push('/admin/berita');
      router.refresh();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/berita" className="p-2 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Berita Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Input Judul */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Judul Berita</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Contoh: Kerja Bakti Desa..."
          />
        </div>

        {/* Input Gambar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Foto Sampul</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="relative h-48 w-full">
                <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <Upload size={32} className="mb-2" />
                <p>Klik untuk upload gambar (Maks 2MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Konten */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Isi Berita</label>
          <textarea
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            placeholder="Tulis isi berita di sini..."
          />
          <p className="text-xs text-slate-400 mt-2">* Gunakan Enter untuk paragraf baru.</p>
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Simpan Berita
          </button>
        </div>

      </form>
    </div>
  );
}
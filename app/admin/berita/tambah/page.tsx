'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 1. IMPORT LIBRARY
import imageCompression from 'browser-image-compression';

export default function AddNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State Kompresi
  const [isCompressing, setIsCompressing] = useState(false);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  // 2. LOGIC UPLOAD DENGAN KOMPRESI
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];

      if (!originalFile.type.startsWith('image/')) {
        alert('Harap upload file gambar.');
        return;
      }

      setIsCompressing(true);

      try {
        const options = {
          maxSizeMB: 0.5,         // Max 500KB
          maxWidthOrHeight: 1200, // Lebar max 1200px (cukup untuk berita)
          useWebWorker: true,
          fileType: 'image/webp'  // Convert ke WebP
        };

        const compressedFile = await imageCompression(originalFile, options);
        
        setImageFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));

      } catch (error) {
        console.error("Gagal kompres gambar:", error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        // Paksa ekstensi .webp
        const fileName = `berita-${Date.now()}.webp`; 
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

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
      {/* ... Header tetap ... */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/berita" className="p-2 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Berita Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* ... Input Judul ... */}
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

        {/* 3. UPDATE UI INPUT GAMBAR */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Foto Sampul
            {isCompressing && <span className="text-green-600 ml-2 text-xs animate-pulse">(Mengompres gambar...)</span>}
          </label>
          <div className={`border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition relative ${isCompressing ? 'opacity-50 cursor-wait' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isCompressing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
            />
            {previewUrl ? (
              <div className="relative h-48 w-full">
                <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                {isCompressing ? <Loader2 className="animate-spin mb-2" size={32}/> : <Upload size={32} className="mb-2" />}
                <p>Klik untuk upload gambar</p>
              </div>
            )}
          </div>
        </div>

        {/* ... Input Konten & Submit ... */}
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
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading || isCompressing}
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
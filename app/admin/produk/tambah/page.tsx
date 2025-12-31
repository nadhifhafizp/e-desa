'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Save, DollarSign, Phone } from 'lucide-react'; // Tambah icon Phone
import Image from 'next/image';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState(''); // State baru untuk WA
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // 1. Upload Gambar
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `produk-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // 2. Simpan Data (Termasuk contact_number)
      const { error: dbError } = await supabase
        .from('marketplace_items')
        .insert([{
            name,
            price: parseInt(price),
            category,
            description,
            contact_number: contactNumber, // Simpan nomor WA
            image_url: imageUrl,
            is_available: true,
        }]);

      if (dbError) throw dbError;

      alert('Produk berhasil ditambahkan!');
      router.push('/admin/produk');
      router.refresh();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/produk" className="p-2 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Jual Produk Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Produk</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Contoh: Keripik Singkong Balado"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Harga */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Harga (Rp)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="15000"
                    />
                </div>
            </div>

            {/* Nomor WA (BARU) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input
                        type="text"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="628123456789" // Placeholder memberi contoh format
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1">Gunakan awalan 62 (contoh: 62812...)</p>
            </div>
        </div>

        {/* Kategori */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
            <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-emerald-700 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
                <option value="Makanan">Makanan & Minuman</option>
                <option value="Kerajinan">Kerajinan Tangan</option>
                <option value="Fashion">Fashion & Kain</option>
                <option value="Jasa">Jasa</option>
                <option value="Pertanian">Hasil Tani</option>
            </select>
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Foto Produk</label>
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
                <p>Upload Foto Produk</p>
              </div>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Singkat</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Jelaskan keunggulan produk ini..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Simpan Produk
        </button>

      </form>
    </div>
  );
}
'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload, DollarSign, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State Form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  // State untuk upload baru
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Ambil Data Lama saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert('Data produk tidak ditemukan!');
        router.push('/admin/produk');
      } else {
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category);
        setDescription(data.description || '');
        setContactNumber(data.contact_number || '');
        setCurrentImageUrl(data.image_url);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // Handle Pilih Gambar Baru
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Simpan Perubahan (Update)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = currentImageUrl;

      // Jika ada gambar baru, upload dulu
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `produk-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      // Update ke Database
      const { error } = await supabase
        .from('marketplace_items')
        .update({
            name,
            price: parseInt(price),
            category,
            description,
            contact_number: contactNumber,
            image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      alert('Produk berhasil diperbarui!');
      router.push('/admin/produk');
      router.refresh();

    } catch (error: any) {
      alert('Gagal update: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Mengambil data produk...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/produk" className="p-2 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Edit Produk</h1>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nama Produk</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Harga */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Harga (Rp)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                </div>
            </div>
            {/* WhatsApp */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input
                        type="text"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                </div>
            </div>
        </div>

        {/* Kategori */}
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
            <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none bg-white transition"
            >
                <option value="Makanan">Makanan & Minuman</option>
                <option value="Kerajinan">Kerajinan Tangan</option>
                <option value="Fashion">Fashion & Kain</option>
                <option value="Jasa">Jasa</option>
                <option value="Pertanian">Hasil Tani</option>
                <option value="Lainnya">Lainnya</option>
            </select>
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Foto Produk</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition relative group cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            />
            
            {previewUrl || currentImageUrl ? (
              <div className="relative h-64 w-full">
                <Image 
                  src={previewUrl || currentImageUrl || ''} 
                  alt="Preview" 
                  fill 
                  className="object-contain" 
                />
                {/* Overlay teks ganti */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white font-medium">
                   Klik untuk ganti foto
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500 py-4">
                <Upload size={32} className="mb-2" />
                <p>Klik untuk upload foto baru</p>
              </div>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-emerald-900 border-slate-300 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-green-600/20"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Simpan Perubahan
        </button>

      </form>
    </div>
  );
}
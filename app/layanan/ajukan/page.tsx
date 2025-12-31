'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function AjukanPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Memuat formulir...</div>}>
      <FormContent />
    </Suspense>
  );
}

function FormContent() {
  const searchParams = useSearchParams();
  const jenisSuratID = searchParams.get('jenis'); 

  const letterNames: Record<string, string> = {
    sktm: 'Surat Keterangan Tidak Mampu (SKTM)',
    domisili: 'Surat Keterangan Domisili',
    usaha: 'Surat Keterangan Usaha (SKU)',
    kelahiran: 'Surat Pengantar Akta Kelahiran',
    kematian: 'Surat Keterangan Kematian',
    skck: 'Surat Pengantar SKCK',
  };

  const letterTitle = letterNames[jenisSuratID || ''] || 'Layanan Surat Umum';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nik: '',
    full_name: '',
    whatsapp: '',
    reason: ''
  });

  // UPDATE: Fungsi Handle Change dengan Validasi Angka & Max Length
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validasi Khusus untuk NIK dan WhatsApp
    if (name === 'nik' || name === 'whatsapp') {
      // 1. Hapus karakter selain angka (biar user gak bisa ketik huruf)
      const numericValue = value.replace(/[^0-9]/g, '');

      // 2. Khusus NIK, batasi panjang string jadi 16 karakter
      if (name === 'nik' && numericValue.length > 16) {
        return; // Jangan update state jika lebih dari 16
      }

      setFormData({ ...formData, [name]: numericValue });
    } else {
      // Untuk input teks biasa (Nama, Alasan)
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi tambahan sebelum submit
    if (formData.nik.length !== 16) {
      alert('NIK harus berjumlah 16 digit!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('letter_requests')
        .insert([{
          nik: formData.nik,
          full_name: formData.full_name,
          whatsapp: formData.whatsapp,
          letter_type: letterTitle,
          reason: formData.reason,
          status: 'Pending'
        }]);

      if (error) throw error;
      setSuccess(true);
      
    } catch (err: any) {
      alert('Gagal mengirim permohonan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <FadeIn>
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Berhasil Terkirim!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Permohonan <strong>{letterTitle}</strong> Anda sudah masuk. 
              Admin Desa akan segera memprosesnya dan menghubungi Anda via WhatsApp.
            </p>
            <Link href="/layanan" className="block w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">
              Kembali ke Menu Layanan
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header Hijau */}
      <section className="bg-green-900 text-white pt-32 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto text-center relative z-10">
            <Link href="/layanan" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-6 transition bg-green-800/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <ArrowLeft size={16} /> Kembali ke Daftar Layanan
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Formulir Pengajuan</h1>
            <p className="text-green-100">Silakan lengkapi data diri Anda di bawah ini.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <FadeIn delay={0.2}>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 max-w-3xl mx-auto">
            
            <div className="flex items-start gap-4 mb-10 pb-8 border-b border-slate-100">
               <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                  <FileText size={32} />
               </div>
               <div>
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Jenis Surat</span>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">{letterTitle}</h2>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* UPDATE: Input NIK */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">NIK (Nomor Induk Kependudukan)</label>
                  <input 
                    type="text"            // Ganti ke text agar maxLength jalan
                    inputMode="numeric"    // Keyboard HP tetap angka
                    maxLength={16}         // Batas HTML
                    name="nik"
                    required
                    placeholder="16 digit angka NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium tracking-wide"
                  />
                  {/* Feedback jumlah digit */}
                  <p className={`text-xs text-right ${formData.nik.length === 16 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                    {formData.nik.length} / 16
                  </p>
                </div>
                
                {/* UPDATE: Input WhatsApp */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nomor WhatsApp Aktif</label>
                  <input 
                    type="text"
                    inputMode="numeric"
                    name="whatsapp"
                    required
                    placeholder="Contoh: 628123456789"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium"
                  />
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    *Gunakan awalan 62 atau 08.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="full_name"
                  required
                  placeholder="Isi nama lengkap sesuai KTP"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Keperluan / Keterangan</label>
                <textarea 
                  name="reason"
                  required
                  rows={4}
                  placeholder="Jelaskan secara singkat keperluan surat ini..."
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-5 rounded-xl shadow-lg shadow-green-600/20 transition disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <> <Loader2 className="animate-spin" /> Sedang Mengirim... </>
                ) : (
                  <> <Save size={20} /> Kirim Permohonan </>
                )}
              </button>

            </form>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
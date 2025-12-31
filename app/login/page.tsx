'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect ke dashboard admin setelah sukses
      router.push('/admin');
      router.refresh();
      
    } catch (error: any) {
      alert('Login Gagal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-green-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-12 relative z-10 border border-slate-100">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/30">
             <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Desa</h1>
          <p className="text-slate-500 mt-2 text-sm">Masuk untuk mengelola website desa.</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
               <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
               <input 
                 type="email" 
                 required
                 placeholder="admin@desa.id"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
               />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
               <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
               <input 
                 type="password" 
                 required
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 rounded-xl text-emerald-900 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" /> 
            ) : (
              <> Masuk Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition" /> </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center">
           <Link href="/" className="text-sm text-slate-400 hover:text-green-600 transition">
              Kembali ke Halaman Utama
           </Link>
        </div>

      </div>
    </main>
  );
}
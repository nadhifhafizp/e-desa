'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Users, Map, Home, Zap, MapPin, 
  ArrowUpRight, TrendingUp 
} from 'lucide-react';

// HELPER: Komponen Angka yang bergerak naik (CountUp)
function AnimatedNumber({ value, label }: { value: number, label?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    // Durasi animasi tergantung besarnya angka (max 2 detik)
    const duration = 2000; 
    const incrementTime = 16; // ~60fps
    const step = (end / duration) * incrementTime;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {count.toLocaleString('id-ID')}
      {label && <span className="text-xs text-slate-400 font-normal ml-1">{label}</span>}
    </>
  );
}

// HELPER: Komponen Progress Bar dengan animasi tumbuh
function AnimatedBar({ value, total, color }: { value: number, total: number, color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Delay sedikit agar efeknya terasa setelah halaman load
    const timeout = setTimeout(() => {
      const percent = total > 0 ? (value / total) * 100 : 0;
      setWidth(percent);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value, total]);

  return (
    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1500 ease-out flex items-center justify-end pr-2`} 
        style={{ width: `${width}%` }}
      >
      </div>
    </div>
  );
}


// KOMPONEN UTAMA
export default function InfoGrafisView({ stats }: { stats: any[] }) {
  
  // Helper filter data
  const getVal = (label: string) => stats?.find(s => s.label === label)?.value || 0;
  const getByCat = (cat: string) => stats?.filter(s => s.category === cat) || [];

  // Hitung Data Utama
  const laki = getVal('Laki-laki');
  const perempuan = getVal('Perempuan');
  const totalPenduduk = laki + perempuan;
  const luasWilayah = getVal('Luas Wilayah (km²)') || 7; // Default 7 jika kosong
  const kepadatan = Math.round(totalPenduduk / luasWilayah);

  // State untuk animasi entry (muncul perlahan)
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <div className={`container mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Info Grafis Desa</h1>
          <p className="text-green-100 max-w-2xl mx-auto text-lg">
            Data statistik perkembangan Desa Sukalaksana yang transparan dan akurat.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20 space-y-16">

        {/* 2. HIGHLIGHT CARDS (Angka Bergerak) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Total Penduduk */}
          <div className={`bg-white p-8 rounded-2xl shadow-xl border-b-4 border-blue-500 transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={32} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Penduduk</p>
            </div>
            <h3 className="text-5xl font-bold text-slate-800">
              <AnimatedNumber value={totalPenduduk} />
            </h3>
            <p className="text-sm text-slate-400 mt-2">Jiwa</p>
          </div>

          {/* Card Luas Wilayah */}
          <div className={`bg-white p-8 rounded-2xl shadow-xl border-b-4 border-emerald-500 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Map size={32} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Luas Wilayah</p>
            </div>
            <h3 className="text-5xl font-bold text-slate-800">
              <AnimatedNumber value={luasWilayah} />
            </h3>
            <p className="text-sm text-slate-400 mt-2">Kilometer Persegi</p>
          </div>

          {/* Card Kepadatan */}
          <div className={`bg-white p-8 rounded-2xl shadow-xl border-b-4 border-orange-500 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <TrendingUp size={32} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Kepadatan</p>
            </div>
            <h3 className="text-5xl font-bold text-slate-800">
              <AnimatedNumber value={kepadatan} />
            </h3>
            <p className="text-sm text-slate-400 mt-2">Jiwa / km²</p>
          </div>
        </div>

        {/* 3. DEMOGRAFI GENDER (Grafik Batang Tumbuh) */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Demografi Penduduk</h2>
            <div className="space-y-8">
              {/* Laki-laki */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><Users size={18} className="text-blue-500"/> Laki-laki</span>
                  <span className="font-bold text-2xl text-slate-800"><AnimatedNumber value={laki} label="Jiwa" /></span>
                </div>
                <AnimatedBar value={laki} total={totalPenduduk} color="bg-blue-500" />
                <p className="text-right text-xs text-slate-400 mt-2">{(laki/totalPenduduk*100).toFixed(1)}%</p>
              </div>

              {/* Perempuan */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><Users size={18} className="text-pink-500"/> Perempuan</span>
                  <span className="font-bold text-2xl text-slate-800"><AnimatedNumber value={perempuan} label="Jiwa" /></span>
                </div>
                <AnimatedBar value={perempuan} total={totalPenduduk} color="bg-pink-500" />
                <p className="text-right text-xs text-slate-400 mt-2">{(perempuan/totalPenduduk*100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="relative h-100 rounded-2xl overflow-hidden shadow-2xl group">
             <Image 
               src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070" 
               alt="Warga Desa" 
               fill 
               className="object-cover transition duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-linear-to-t from-green-900/80 to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white max-w-sm">
                <p className="font-bold text-lg">Desa Sukalaksana</p>
                <p className="text-sm text-green-100">Masyarakat yang rukun, damai, dan saling gotong royong membangun desa.</p>
             </div>
          </div>
        </div>

        {/* 4. WILAYAH & LAINNYA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Loop Data Wilayah */}
           {getByCat('wilayah').map((item, idx) => (
              <div 
                key={item.id} 
                className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300`}
                // style={{ transitionDelay: `${idx * 100}ms` }} // Stagger effect
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <MapPin size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300" />
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800 mb-1">
                    <AnimatedNumber value={item.value} />
                 </h3>
                 <p className="text-slate-500 text-sm font-medium">{item.label}</p>
              </div>
           ))}
        </div>

        {/* 5. SARANA & EKONOMI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Home className="text-orange-500" /> Sarana Desa
                </h3>
                <div className="grid gap-4">
                   {getByCat('sarana').map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg group hover:bg-orange-50 transition">
                         <span className="text-slate-600 font-medium group-hover:text-orange-700">{item.label}</span>
                         <span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-md shadow-sm border group-hover:border-orange-200">
                            {item.value} Unit
                         </span>
                      </div>
                   ))}
                </div>
            </div>

            <div className="bg-linear-to-br from-green-800 to-green-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition duration-700">
                   <Zap size={200} />
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                   <Zap className="text-yellow-400" /> Ekonomi & Kesejahteraan
                </h3>
                
                <div className="grid gap-4 relative z-10">
                   {getByCat('ekonomi').map((item) => (
                      <div key={item.id} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/20 transition">
                         <p className="text-green-200 text-sm mb-2 uppercase tracking-wide">{item.label}</p>
                         <p className="text-4xl font-bold">
                            <AnimatedNumber value={item.value} />
                         </p>
                         <p className="text-xs text-green-300 mt-2">Kepala Keluarga (KK)</p>
                      </div>
                   ))}
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
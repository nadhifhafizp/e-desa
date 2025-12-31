import Link from 'next/link';
import { 
  FileText, Home, Briefcase, GraduationCap, 
  Heart, Shield, AlertCircle, ArrowRight, MessageCircle 
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function LayananPage() {
  
  // Daftar Layanan
  const services = [
    {
      id: 'sktm',
      title: 'Surat Keterangan Tidak Mampu (SKTM)',
      desc: 'Untuk keperluan beasiswa, bantuan kesehatan, atau bantuan sosial.',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'hover:border-pink-200'
    },
    {
      id: 'domisili',
      title: 'Surat Keterangan Domisili',
      desc: 'Bukti tempat tinggal untuk keperluan bank, pekerjaan, atau pindah.',
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200'
    },
    {
      id: 'usaha',
      title: 'Surat Keterangan Usaha (SKU)',
      desc: 'Untuk persyaratan pinjaman KUR, izin usaha mikro, atau dagang.',
      icon: Briefcase,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'hover:border-orange-200'
    },
    {
      id: 'kelahiran',
      title: 'Surat Pengantar Akta Kelahiran',
      desc: 'Dokumen pengantar untuk pembuatan akta kelahiran bayi baru lahir.',
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'hover:border-green-200'
    },
    {
      id: 'kematian',
      title: 'Surat Keterangan Kematian',
      desc: 'Untuk pengurusan waris, asuransi, atau administrasi kependudukan.',
      icon: AlertCircle,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'hover:border-slate-200'
    },
    {
      id: 'skck',
      title: 'Pengantar SKCK',
      desc: 'Surat pengantar desa untuk pembuatan SKCK di kepolisian.',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'hover:border-purple-200'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HERO SECTION (UPDATED: Konsisten dengan Profil & Info Grafis) */}
      <section className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <span className="inline-block py-1 px-3 rounded-full bg-green-800 text-green-200 text-sm font-semibold mb-4 border border-green-700">
              E-Pelayanan Desa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Layanan Surat Online</h1>
            <p className="text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
              Urus administrasi desa lebih cepat, mudah, dan bisa dari rumah.
              Silakan pilih jenis surat yang Anda butuhkan di bawah ini.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. GRID LAYANAN (Layout Kartu Naik ke Atas -mt-16) */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <FadeIn key={service.id} delay={idx * 0.1}>
              <Link href={`/layanan/ajukan?jenis=${service.id}`}>
                <div className={`group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${service.border} h-full flex flex-col`}>
                  
                  <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm`}>
                    <service.icon size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed grow">
                    {service.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-bold text-green-600 mt-auto bg-green-50 w-fit px-4 py-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    Ajukan Sekarang <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>

                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* 3. INFO TAMBAHAN / CONTACT SUPPORT */}
        <FadeIn delay={0.6}>
          <div className="mt-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-4xl mx-auto relative overflow-hidden">
             {/* Dekorasi Background */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12 opacity-50"></div>

             <div className="relative z-10">
               <h3 className="text-2xl font-bold text-slate-800 mb-3">Butuh Bantuan Lainnya?</h3>
               <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
                 Jika Anda mengalami kesulitan teknis atau surat yang Anda butuhkan tidak tersedia di daftar layanan mandiri, 
                 tim pelayanan desa siap membantu Anda melalui WhatsApp.
               </p>
               <a 
                 href="https://wa.me/628123456789" // Ganti dengan nomor Admin Desa
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition shadow-lg hover:shadow-green-600/30"
               >
                 <MessageCircle size={20} /> Chat Admin Desa
               </a>
             </div>
          </div>
        </FadeIn>
      </div>

    </main>
  );
}
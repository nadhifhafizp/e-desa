import Image from 'next/image';
import { 
  MapPin, Calendar, Award, Target, 
  Users, CheckCircle2, ArrowRight 
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. HERO SECTION (Konsisten dengan Info Grafis & Layanan) */}
      <section className="bg-green-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <span className="inline-block py-1 px-3 rounded-full bg-green-800 text-green-200 text-sm font-semibold mb-4 border border-green-700">
              Profil Desa
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Mengenal Desa Sukalaksana</h1>
            <p className="text-green-100 max-w-3xl mx-auto text-lg leading-relaxed">
              Sebuah desa yang asri, mandiri, dan menjunjung tinggi nilai gotong royong 
              di Kecamatan Sukakarya, Kabupaten Bekasi.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. SEJARAH DESA (Text Heavy & Informatif) */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Kolom Gambar */}
              <div className="relative h-64 lg:h-auto min-h-100">
                <Image 
                  src="https://images.unsplash.com/photo-1625246333195-5842b4674af5?q=80&w=2070" 
                  alt="Suasana Desa Sukalaksana" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-green-900/20"></div>
                
                {/* Badge Tahun Berdiri (Contoh) */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-50">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tahun Berdiri</p>
                   <p className="text-3xl font-bold text-green-800">1985</p>
                </div>
              </div>

              {/* Kolom Teks Sejarah */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Calendar className="text-green-600" /> Sejarah Desa
                </h2>
                
                <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
                  <p>
                    Desa Sukalaksana merupakan salah satu desa yang berada di wilayah Kecamatan Sukakarya, Kabupaten Bekasi. 
                    Nama "Sukalaksana" sendiri diambil dari filosofi masyarakat terdahulu yang memiliki arti "Suka Melaksanakan" 
                    kebaikan dan pembangunan demi kemajuan bersama.
                  </p>
                  <p>
                    Sejak awal berdirinya, desa ini dikenal dengan lahan pertaniannya yang subur dan masyarakatnya yang 
                    mayoritas bermatapencaharian sebagai petani. Seiring berjalannya waktu, Desa Sukalaksana terus 
                    bertransformasi menjadi desa yang tidak hanya mengandalkan sektor agraris, tetapi juga mulai 
                    mengembangkan potensi UMKM dan pelayanan publik berbasis digital.
                  </p>
                  <p>
                    Hingga saat ini, Desa Sukalaksana terus berbenah untuk mewujudkan tata kelola pemerintahan yang 
                    transparan, akuntabel, dan partisipatif, sesuai dengan semangat otonomi desa.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-green-700">
                        KD
                     </div>
                     <div>
                        <p className="text-sm text-slate-500">Kepala Desa Saat Ini</p>
                        <p className="font-bold text-slate-800 text-lg">H. Tamin Komarudin</p>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. VISI & MISI (Styling Modern) */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Kartu Visi */}
           <FadeIn delay={0.3} className="md:col-span-1">
             <div className="bg-green-800 text-white p-8 rounded-3xl h-full flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Target size={120} />
               </div>
               <span className="inline-block py-1 px-3 rounded-full bg-green-700 text-green-200 text-xs font-bold mb-4 w-fit">
                 VISI DESA
               </span>
               <h3 className="text-2xl md:text-3xl font-bold leading-snug mb-4 relative z-10">
                 "Terwujudnya Desa Sukalaksana yang Maju, Mandiri, Sejahtera, dan Religius."
               </h3>
               <div className="w-20 h-1 bg-yellow-400 rounded-full mt-auto"></div>
             </div>
           </FadeIn>

           {/* Kartu Misi */}
           <FadeIn delay={0.4} className="md:col-span-2">
             <div className="bg-white p-8 rounded-3xl border border-slate-200 h-full shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                   <Target size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800">Misi Pembangunan</h3>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   "Mewujudkan pemerintahan desa yang jujur, transparan, dan berwibawa.",
                   "Meningkatkan kualitas pelayanan publik yang cepat dan mudah.",
                   "Mengembangkan perekonomian desa melalui BUMDes dan UMKM.",
                   "Meningkatkan kualitas infrastruktur dan sarana prasarana desa.",
                   "Melestarikan nilai-nilai budaya dan kearifan lokal.",
                   "Meningkatkan kualitas sumber daya manusia melalui pendidikan dan kesehatan."
                 ].map((misi, idx) => (
                   <div key={idx} className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-lg transition">
                     <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                     <p className="text-slate-600 text-sm leading-relaxed">{misi}</p>
                   </div>
                 ))}
               </div>
             </div>
           </FadeIn>

        </div>
      </section>

      {/* 4. FAKTA GEOGRAFIS (Data dari PDF) */}
      <section className="bg-slate-100 py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-800">Gambaran Umum Wilayah</h2>
             <p className="text-slate-500 mt-2">Data geografis berdasarkan statistik kecamatan terbaru.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Luas Wilayah', value: '7,01 km²', icon: MapPin },
               { label: 'Jarak ke Kecamatan', value: '3 km', icon: ArrowRight },
               { label: 'Jarak ke Kabupaten', value: '25 km', icon: ArrowRight },
               { label: 'Status Wilayah', value: 'Bukan Tepi Laut', icon: MapPin }, // Dari PDF hal 31
             ].map((item, idx) => (
               <FadeIn key={idx} delay={idx * 0.1}>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                    <div className="w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <item.icon size={24} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-1">{item.value}</h4>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{item.label}</p>
                 </div>
               </FadeIn>
             ))}
          </div>
        </div>
      </section>

      {/* 5. STRUKTUR ORGANISASI */}
      <section className="container mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-800">Perangkat Desa</h2>
           <a href="#" className="text-green-600 font-semibold hover:underline">Lihat Bagan Lengkap</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card Kepala Desa (Spesial) */}
          <FadeIn>
            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" // Ganti foto Pak Kades
                alt="Kepala Desa"
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <p className="bg-green-600 text-xs font-bold px-2 py-1 rounded w-fit mb-2">KEPALA DESA</p>
                <h3 className="text-xl font-bold">H. Tamingn</h3>
                <p className="text-slate-300 text-sm">Periode 2018-2024</p>
              </div>
            </div>
          </FadeIn>

          {/* Card Perangkat Lainnya (Looping) */}
          {[
            { nama: 'Budi Santoso', jabatan: 'Sekretaris Desa' },
            { nama: 'Siti Aminah', jabatan: 'Kaur Keuangan' },
            { nama: 'Ahmad Rizki', jabatan: 'Kaur Perencanaan' },
          ].map((staff, idx) => (
             <FadeIn key={idx} delay={(idx+1) * 0.1}>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition text-center h-full flex flex-col items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden relative">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${staff.nama}&background=random`} 
                        alt={staff.nama}
                        fill
                        className="object-cover"
                      />
                   </div>
                   <h4 className="font-bold text-slate-800">{staff.nama}</h4>
                   <p className="text-sm text-green-600 font-medium">{staff.jabatan}</p>
                </div>
             </FadeIn>
          ))}
        </div>
      </section>

    </main>
  );
}
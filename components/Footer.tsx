import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Kolom 1: Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">D</div>
              <span className="text-2xl font-bold text-white">Desa Digital</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mewujudkan desa yang mandiri, transparan, dan berdaya saing teknologi untuk kesejahteraan masyarakat.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li><Link href="/profil" className="hover:text-green-500 transition">Profil Desa</Link></li>
              <li><Link href="/info-grafis" className="hover:text-green-500 transition">Data Kependudukan</Link></li>
              <li><Link href="/layanan" className="hover:text-green-500 transition">Layanan Surat</Link></li>
              <li><Link href="/belanja" className="hover:text-green-500 transition">Produk UMKM</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Medsos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3"><MapPin size={18} className="text-green-500"/> Jl. Balai Desa No. 1</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-green-500"/> (021) 123-4567</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-green-500"/> admin@desadigital.id</li>
            </ul>
            <div className="flex gap-4">
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-green-600 transition"><Facebook size={20}/></Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 transition"><Instagram size={20}/></Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 transition"><Twitter size={20}/></Link>
            </div>
          </div>
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Pemerintah Desa Digital. All rights reserved.</p>
          <p className="mt-2 text-green-500/80">Created by <span className="font-semibold text-green-500">Nadhif Hafiz</span></p>
        </div>
      </div>
    </footer>
  );
}
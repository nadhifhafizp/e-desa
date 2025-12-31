'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();

  // 1. Tetap sembunyikan Navbar di halaman Login & Admin
  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return null;
  }

  // 2. STATE SCROLL
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Navbar berubah solid jika di-scroll lebih dari 20px
      setIsScrolled(currentScrollY > 20);

      // Logic Hide/Show navbar saat scroll naik/turun (opsional, biar smooth)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        // Logic Sembunyi/Muncul saat scroll
        isVisible ? "translate-y-0" : "-translate-y-full",
        
        // LOGIC TAMPILAN (PENTING):
        // Jika di-scroll: Putih Solid + Shadow
        // Jika di atas (Top): Transparan Total (Semua Halaman)
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl transition hover:opacity-80">
          <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">D</div>
          {/* Warna Teks: Putih saat di atas, Hitam saat di-scroll */}
          <span className={clsx(
            "transition-colors duration-300",
            !isScrolled ? "text-white drop-shadow-md" : "text-slate-800"
          )}>
            Desa Sukalaksana
          </span>
        </Link>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex gap-1">
          {[
            { name: 'Beranda', href: '/' },
            { name: 'Profil', href: '/profil' },
            { name: 'Info Grafis', href: '/info-grafis' },
            { name: 'Layanan', href: '/layanan' },
            { name: 'Belanja', href: '/belanja' },
          ].map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  // Logic Warna Menu:
                  // 1. Saat Active:
                  //    - Di atas: Background Putih Transparan
                  //    - Di scroll: Hijau
                  // 2. Saat Tidak Active:
                  //    - Di atas: Putih Polos
                  //    - Di scroll: Abu-abu
                  isActive 
                    ? (!isScrolled ? "bg-white/20 text-white backdrop-blur-sm" : "bg-green-100 text-green-700")
                    : (!isScrolled ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-green-700 hover:bg-green-50")
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* MENU MOBILE (HAMBURGER) */}
        <button className={clsx(
          "md:hidden p-2 rounded-lg transition",
          !isScrolled ? "text-white" : "text-slate-700"
        )}>
          <Menu className="h-6 w-6" />
        </button>

      </div>
    </nav>
  );
}
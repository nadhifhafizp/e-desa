'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Newspaper, ShoppingBag, 
  Users, FileText, LogOut, Menu, X 
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // DEFAULT: FALSE (Tertutup) agar aman di Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cek sesi login
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  // Tutup sidebar otomatis saat pindah halaman (UX Mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Berita & Artikel', href: '/admin/berita', icon: Newspaper },
    { name: 'Produk UMKM', href: '/admin/produk', icon: ShoppingBag },
    { name: 'Data Penduduk', href: '/admin/penduduk', icon: Users },
    { name: 'Layanan Surat', href: '/admin/layanan', icon: FileText },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      
      {/* 1. MOBILE OVERLAY (Black Background) */}
      {/* Muncul hanya di mobile saat sidebar terbuka */}
      <div 
        onClick={() => setSidebarOpen(false)}
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      />

      {/* 2. SIDEBAR */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static shadow-xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
          <span className="text-xl font-bold text-green-400">Admin Panel</span>
          {/* Tombol Close Sidebar (Hanya di Mobile) */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                key={item.href}
                href={item.href}
                className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                    ? "bg-green-600 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
                </Link>
            );
          })}

          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </nav>
      </aside>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Mobile */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <span className="font-bold text-slate-700">Menu Admin</span>
            <button 
              onClick={() => setSidebarOpen(true)} // Buka Sidebar
              className="p-2 bg-slate-100 rounded hover:bg-slate-200 text-slate-700"
            >
                <Menu size={24}/>
            </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Plus, ShoppingBag, PenSquare } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

export const revalidate = 0;

export default async function AdminProdukPage() {
  const { data: products } = await supabase
    .from('marketplace_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Produk UMKM Desa</h1>
           <p className="text-slate-500 text-sm">Kelola produk jualan warga.</p>
        </div>
        <Link 
          href="/admin/produk/tambah" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
        >
          <Plus size={20} /> Tambah Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-center">
            
            {/* Foto Kecil */}
            <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
              <Image 
                src={item.image_url || '/placeholder-product.jpg'} 
                alt={item.name} 
                fill 
                className="object-cover"
              />
            </div>

            {/* Info Produk */}
            <div className="grow min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
              <p className="text-green-600 font-semibold text-sm">
                Rp {item.price?.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">
                  {item.category}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.is_available ? 'Stok Ada' : 'Habis'}
                </span>
              </div>
            </div>

            {/* Tombol Aksi (SELALU MUNCUL) */}
            {/* Saya hapus 'opacity-0' dan 'group-hover' disini */}
            <div className="flex flex-col gap-2 shrink-0">
               {/* TOMBOL EDIT */}
               <Link 
                 href={`/admin/produk/edit/${item.id}`}
                 className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                 title="Edit Produk"
               >
                 <PenSquare size={18} />
               </Link>

               {/* TOMBOL HAPUS */}
               <DeleteButton id={item.id} table="marketplace_items" />
            </div>

          </div>
        ))}
        
        {(!products || products.length === 0) && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <ShoppingBag className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-500">Belum ada produk UMKM.</p>
          </div>
        )}
      </div>
    </div>
  );
}
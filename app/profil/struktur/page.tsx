import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function StrukturPage() {
  // Ambil data dan urutkan berdasarkan order_index (pastikan kamu input order_index nanti di database)
  const { data: members } = await supabase
    .from('organization_members')
    .select('*')
    .order('order_index', { ascending: true });

  const pemdes = members?.filter(m => m.organization_type === 'pemerintah_desa') || [];
  const bpd = members?.filter(m => m.organization_type === 'bpd') || [];

  // Helper component untuk Kartu Anggota
  const MemberCard = ({ member, isLeader = false }: { member: any, isLeader?: boolean }) => (
    <div className={`flex flex-col items-center text-center ${isLeader ? 'md:w-1/3 mx-auto' : ''}`}>
      <div className={`relative rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 
        ${isLeader ? 'w-48 h-48 md:w-56 md:h-56' : 'w-32 h-32 md:w-40 md:h-40'}`}>
        <Image 
          src={member.image_url || '/placeholder-avatar.jpg'} // Pastikan ada placeholder
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 min-w-50">
        <h3 className={`font-bold text-slate-800 ${isLeader ? 'text-xl' : 'text-lg'}`}>{member.name}</h3>
        <p className={`text-green-600 font-medium ${isLeader ? 'text-base' : 'text-sm'}`}>{member.position}</p>
      </div>
      {/* Garis konektor visual (dekorasi) */}
      {!isLeader && <div className="h-8 w-0.5 bg-slate-300 -mt-20 -z-10"></div>} 
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-10">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h1 className="text-4xl font-bold text-center text-slate-800 mb-12">Struktur Organisasi</h1>
        </FadeIn>

        {/* 1. PEMERINTAH DESA */}
        <section className="mb-20">
          <FadeIn>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-center text-green-700 mb-10 uppercase tracking-widest border-b pb-4">
                Pemerintah Desa
              </h2>
              
              <div className="flex flex-col gap-12 relative">
                {/* Garis vertikal tengah (Tree line) */}
                <div className="absolute top-20 left-1/2 w-0.5 h-[80%] bg-slate-200 -translate-x-1/2 hidden md:block z-0"></div>

                {/* Level 1: Kepala Desa (Item pertama di array) */}
                {pemdes.length > 0 && (
                   <div className="relative z-10">
                      <MemberCard member={pemdes[0]} isLeader={true} />
                   </div>
                )}

                {/* Level 2: Sekretaris & Staff (Sisa array) */}
                {pemdes.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10 pt-8 border-t border-slate-100 md:border-t-0">
                    {pemdes.slice(1).map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 2. BPD (Badan Permusyawaratan Desa) */}
        <section>
          <FadeIn>
             <div className="bg-slate-200 rounded-3xl p-8 md:p-12">
               <h2 className="text-2xl font-bold text-center text-slate-700 mb-10 uppercase tracking-widest border-b border-slate-300 pb-4">
                 Badan Permusyawaratan Desa (BPD)
               </h2>
               <div className="flex flex-wrap justify-center gap-10">
                 {bpd.map((member) => (
                    <MemberCard key={member.id} member={member} />
                 ))}
               </div>
             </div>
          </FadeIn>
        </section>

      </div>
      <div className="h-20"></div>
      <Footer />
    </main>
  );
}
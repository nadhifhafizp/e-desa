import { supabase } from '@/lib/supabase';
import InfoGrafisView from '@/components/InfoGrafisView';

// Revalidate data setiap 1 jam (agar tidak berat load database terus)
export const revalidate = 3600;

export default async function InfoGrafisPage() {
  const { data: stats } = await supabase
    .from('demographic_stats')
    .select('*')
    .order('value', { ascending: false });

  return (
    // Kirim data ke Client Component untuk di-animasikan
    <InfoGrafisView stats={stats || []} />
  );
}
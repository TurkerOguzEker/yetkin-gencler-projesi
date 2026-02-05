import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuyuruDetayPage({ params }: PageProps) {
  const { id } = await params;

  const { data: duyuru } = await supabase
    .from('duyurular')
    .select('*')
    .eq('id', id)
    .single();

  if (!duyuru) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Geri Dön (Eğitim detaydakiyle aynı stil) */}
        <Link href="/#duyurular" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-bold transition group">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white mr-3 transition">←</span>
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          {/* Üst Başlık (Eğitim detaydaki gibi gradyan ve süslü) */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold mb-6 inline-block border border-white/10">
                Resmi Duyuru
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{duyuru.baslik}</h1>
              
              <div className="flex items-center gap-2 bg-orange-900/20 px-4 py-2 rounded-xl border border-white/10 w-fit">
                <span>📅</span>
                <span className="font-medium text-orange-50">Tarih: {new Date(duyuru.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* İçerik */}
          <div className="p-10 md:p-16">
            <div className="text-gray-600 leading-loose text-lg whitespace-pre-wrap">
              {duyuru.icerik}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
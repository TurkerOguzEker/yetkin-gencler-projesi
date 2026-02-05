import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import BasvuruButonu from "@/components/BasvuruButonu";

// Sayfa her açıldığında verilerin taze olmasını sağlar
export const revalidate = 0;
export const dynamic = "force-dynamic";

interface PageProps {
  // DÜZELTME: params artık bir Promise'dir
  params: Promise<{ id: string }>;
}

export default async function EgitimDetayPage({ params }: PageProps) {
  // DÜZELTME: params'ı await ile bekliyoruz
  const { id } = await params;

  // Veritabanından eğitimi çek
  const { data: egitim } = await supabase
    .from('egitimler')
    .select('*')
    .eq('id', id)
    .single();

  if (!egitim) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Geri Dön Linki */}
        <Link href="/egitimler" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-bold transition group">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white mr-3 transition">←</span>
          Tüm Eğitimlere Dön
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
          
          {/* Üst Başlık (Header) */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold mb-6 inline-block border border-white/10">
                {egitim.kategori}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{egitim.ad}</h1>
              
              <div className="flex flex-wrap gap-6 text-blue-100 font-medium">
                <div className="flex items-center gap-2 bg-blue-900/50 px-4 py-2 rounded-xl border border-blue-700/50">
                  <span>📅</span>
                  <span>Başlangıç: {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-900/50 px-4 py-2 rounded-xl border border-blue-700/50">
                  <span>👥</span>
                  <span>Kontenjan: {egitim.kontenjan} Kişi</span>
                </div>
              </div>
            </div>
          </div>

          {/* İçerik ve Başvuru */}
          <div className="p-10 md:p-16">
            <div className="flex flex-col md:flex-row gap-12">
              
              {/* Sol: Açıklama */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                  Eğitim Hakkında
                </h2>
                <div className="text-gray-600 leading-loose text-lg whitespace-pre-wrap">
                  {egitim.aciklama}
                </div>
              </div>

              {/* Sağ: Başvuru Kartı */}
              <div className="md:w-1/3">
                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 sticky top-24">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">Hemen Başvur</h3>
                  <p className="text-blue-600/80 text-sm mb-6">
                    Kontenjanlar dolmadan yerini ayırt, geleceğe bir adım at.
                  </p>
                  
                  {/* Başvuru Butonu */}
                  <BasvuruButonu egitimId={egitim.id} />
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
                    Başvurunuz KVKK kapsamında işlenmektedir.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
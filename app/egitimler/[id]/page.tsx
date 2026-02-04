import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

// Bu ayar sayfanın sunucuda her istekte yeniden oluşturulmasını sağlar
export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EgitimDetayPage({ params }: PageProps) {
  // 1. URL'den gelen ID'yi alıyoruz (params.id)
  const { id } = params;

  // 2. Veritabanından bu ID'ye sahip eğitimi çekiyoruz
  const { data: egitim } = await supabase
    .from('egitimler')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Eğer böyle bir eğitim yoksa 404 sayfasına yönlendir
  if (!egitim) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Geri Dön Butonu */}
        <Link href="/egitimler" className="text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center text-sm font-medium transition">
          ← Tüm Eğitimlere Dön
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Üst Başlık Alanı */}
          <div className="bg-blue-900 text-white p-8 md:p-12">
            <span className="bg-blue-700 text-blue-100 text-xs px-3 py-1 rounded-full uppercase tracking-wide font-bold mb-4 inline-block">
              {egitim.kategori}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{egitim.ad}</h1>
            <div className="flex items-center gap-6 text-blue-200 text-sm">
              <span className="flex items-center gap-1">
                📅 Başlangıç: {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}
              </span>
              <span className="flex items-center gap-1">
                👥 Kontenjan: {egitim.kontenjan} Kişi
              </span>
            </div>
          </div>

          {/* İçerik Alanı */}
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Eğitim Hakkında</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
              {egitim.aciklama}
            </p>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-blue-900">Hemen Başvur!</h3>
                <p className="text-blue-700 text-sm">Kontenjan dolmadan yerini ayırt.</p>
              </div>
              
              {/* Burası ileride başvuru formuna bağlanabilir */}
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg w-full md:w-auto text-center">
                Başvuru Formunu Doldur
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
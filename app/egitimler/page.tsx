import { supabase } from "@/lib/supabaseClient";
import Link from 'next/link';
export const revalidate = 0; // Sayfanın her girişte güncel veriyi çekmesini sağlar

export default async function EgitimlerPage() {
  const { data: egitimler } = await supabase.from('egitimler').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-900">Eğitim Programlarımız</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {egitimler?.map((egitim) => (
            <div key={egitim.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                  {egitim.kategori}
                </span>
                <span className="text-gray-400 text-sm">
                  {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">{egitim.ad}</h2>
              <p className="text-gray-600 mb-4">{egitim.aciklama}</p>
              
              <div className="flex justify-between items-center mt-4 border-t pt-4">
                <div className="text-sm text-gray-500">
                  Kontenjan: <span className="font-bold text-gray-800">{egitim.kontenjan} Kişi</span>
                </div>
                {/* Link componentini import etmeyi unutma: import Link from 'next/link'; */}
                    <Link href={`/egitimler/${egitim.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                        İncele & Başvur
                    </Link>
              </div>
            </div>
          ))}

          {egitimler?.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-500">
              Henüz aktif bir eğitim programı bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
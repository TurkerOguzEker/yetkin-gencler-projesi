import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";

// Sayfa her açıldığında verilerin taze olmasını sağlar (Cache kapatma)
export const revalidate = 0;

export default async function Home() {
  // 1. Veritabanından Son 3 Duyuruyu Çek
  const { data: duyurular } = await supabase
    .from('duyurular')
    .select('*')
    .eq('aktif', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // 2. Veritabanından Son 3 Eğitimi Çek
  const { data: egitimler } = await supabase
    .from('egitimler')
    .select('*')
    .order('baslangic_tarihi', { ascending: true })
    .limit(3);

  return (
    <div className="bg-gray-50 pb-20">
      
      {/* --- HERO ALANI (KARŞILAMA) --- */}
      <section className="relative bg-blue-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Arka plan süslemesi (Opsiyonel) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Geleceğin Yetkin <span className="text-blue-300">Gençleri</span> <br />
            Burada Yetişiyor
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Lüleburgaz Belediyesi öncülüğünde, gençlerin mesleki ve sosyal becerilerini geliştirerek istihdama katılmalarını destekliyoruz.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/egitimler" 
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition shadow-lg text-lg"
            >
              Eğitimlere Göz At
            </Link>
            <Link 
              href="/hakkimizda" 
              className="px-8 py-4 bg-blue-800 text-white border border-blue-700 font-bold rounded-full hover:bg-blue-700 transition text-lg"
            >
              Proje Hakkında
            </Link>
          </div>
        </div>
      </section>

      {/* --- EĞİTİMLER VİTRİNİ --- */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-wide text-sm">Kariyer Fırsatları</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Yaklaşan Eğitimler</h2>
          </div>
          <Link href="/egitimler" className="text-blue-600 font-semibold hover:underline hidden md:block">
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {egitimler?.map((egitim) => (
            <div key={egitim.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group">
              <div className="h-3 bg-blue-500 group-hover:bg-blue-600 transition"></div>
              <div className="p-6">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                  {egitim.kategori}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {egitim.ad}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {egitim.aciklama}
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
          
          {egitimler?.length === 0 && (
            <div className="col-span-3 text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Henüz planlanmış bir eğitim bulunmuyor.</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center md:hidden">
           <Link href="/egitimler" className="text-blue-600 font-bold hover:underline">Tüm Eğitimleri İncele</Link>
        </div>
      </section>

      {/* --- DUYURULAR & HABERLER --- */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Duyurular & Haberler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {duyurular?.map((duyuru) => (
              <article key={duyuru.id} className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
                {/* Resim Varsa Göster, Yoksa Gri Alan Göster */}
                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                  {duyuru.resim_url ? (
                    <img src={duyuru.resim_url} alt={duyuru.baslik} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(duyuru.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-snug">
                    {duyuru.baslik}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {duyuru.icerik}
                  </p>
                  <button className="text-blue-600 font-semibold text-sm self-start hover:underline">
                    Devamını Oku
                  </button>
                </div>
              </article>
            ))}

            {duyurular?.length === 0 && (
              <div className="col-span-3 text-center text-gray-500 py-10">
                Yayında olan duyuru bulunamadı.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
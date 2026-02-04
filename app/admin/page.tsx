import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";

// Sayfa her açıldığında verilerin taze olmasını sağlar
export const revalidate = 0;

export default async function Home() {
  // Veritabanından Verileri Çek
  const { data: duyurular } = await supabase
    .from('duyurular')
    .select('*')
    .eq('aktif', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: egitimler } = await supabase
    .from('egitimler')
    .select('*')
    .order('baslangic_tarihi', { ascending: true })
    .limit(3);

  return (
    <div className="bg-white pb-20">
      
      {/* --- 1. BÖLÜM: HERO (KARŞILAMA) ALANI --- */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 md:py-36 overflow-hidden">
        {/* Arka plan deseni */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Sol: Metin */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500 text-white text-xs font-bold tracking-wide mb-4 animate-pulse">
              🚀 YENİ DÖNEM KAYITLARI BAŞLADI
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Geleceğin Yetkin <br/>
              <span className="text-orange-400">Gençleri</span> Burada!
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Lüleburgaz Belediyesi öncülüğünde; teknoloji, inovasyon ve mesleki eğitimlerle kariyerine güçlü bir başlangıç yap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                href="/kayit" 
                className="px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 transform hover:-translate-y-1"
              >
                Hemen Başvur
              </Link>
              <Link 
                href="/egitimler" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition"
              >
                Eğitimleri İncele
              </Link>
            </div>
          </div>
          
          {/* Sağ: Görsel (Temsili) */}
          <div className="flex-1 hidden md:block relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition duration-500">
               {/* Buraya gerçek bir fotoğraf koyabilirsin */}
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Gençler Eğitimde" className="w-full h-full object-cover" />
            </div>
            {/* Dekoratif daire */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* --- 2. BÖLÜM: İSTATİSTİKLER (SAYILARLA BİZ) --- */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Mezun Genç</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">%85</div>
              <div className="text-gray-600 font-medium">İstihdam Oranı</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">20+</div>
              <div className="text-gray-600 font-medium">İş Ortağı</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">12</div>
              <div className="text-gray-600 font-medium">Farklı Eğitim</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. BÖLÜM: NEDEN KATILMALISIN? --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">AVANTAJLAR</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Neden Yetkin Gençler?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Kart 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
              🎓
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Nitelikli Eğitim</h3>
            <p className="text-gray-600">Alanında uzman eğitmenlerden, sektörün ihtiyaçlarına yönelik güncel müfredatla eğitim al.</p>
          </div>

          {/* Kart 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
            <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition">
              🚀
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Kariyer Desteği</h3>
            <p className="text-gray-600">CV hazırlama, mülakat simülasyonları ve mentörlük desteği ile iş hayatına hazırlan.</p>
          </div>

          {/* Kart 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
              🤝
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Güçlü Network</h3>
            <p className="text-gray-600">Sektör liderleri ve diğer yetkin gençlerle tanışma fırsatı yakala, ağını genişlet.</p>
          </div>
        </div>
      </section>

      {/* --- 4. BÖLÜM: EĞİTİMLER (DATABASE'DEN) --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Yaklaşan Eğitimler</h2>
              <p className="text-gray-600 mt-2">Başvurusu devam eden programlarımıza göz atın.</p>
            </div>
            <Link href="/egitimler" className="text-blue-600 font-bold hover:underline hidden md:block">
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {egitimler?.map((egitim) => (
              <div key={egitim.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col h-full">
                <div className="h-2 bg-blue-500"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-bold uppercase">
                      {egitim.kategori}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      📅 {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{egitim.ad}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {egitim.aciklama}
                  </p>
                  <Link 
                    href={`/egitimler/${egitim.id}`}
                    className="block text-center w-full py-3 border border-blue-600 text-blue-600 font-bold rounded hover:bg-blue-600 hover:text-white transition"
                  >
                    Detayları İncele
                  </Link>
                </div>
              </div>
            ))}
            
            {egitimler?.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">Şu an aktif bir eğitim bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- 5. BÖLÜM: PAYDAŞLAR (Logolar) --- */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-8 text-sm">PROJE ORTAKLARIMIZ</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70 grayscale hover:grayscale-0 transition duration-500">
            {/* Temsili Logolar (Yazı olarak) */}
            <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🏛️ <span>Lüleburgaz Belediyesi</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🏢 <span>Yerel Sanayi Kuruluşları</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🏫 <span>Üniversiteler</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
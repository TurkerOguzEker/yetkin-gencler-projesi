import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import MainSlider from "@/components/MainSlider";

export const revalidate = 0;

export default async function Home() {
  const { data: duyurular } = await supabase.from('duyurular').select('*').eq('aktif', true).order('created_at', { ascending: false }).limit(3);
  const { data: egitimler } = await supabase.from('egitimler').select('*').order('baslangic_tarihi', { ascending: true }).limit(3);

  return (
    // DÜZELTME BURADA YAPILDI: "overflow-x-hidden" ve "w-full" eklendi
    <div className="bg-gray-50 pb-20 overflow-x-hidden w-full">
      
      {/* 1. SLIDER ALANI */}
      <MainSlider />

      {/* 2. PROJE AMACI ALANI - MODERN OVAL TASARIM */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Sol: Metin */}
          <div className="flex-1">
            <span className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2 block">Hakkımızda</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8 leading-tight">
              Gençlerin Potansiyelini <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Geleceğe Dönüştürüyoruz</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Yetkin Gençler Projesi; <strong>Kapaklı'da</strong> yaşayan gençlerin kişisel ve mesleki gelişimlerine katkı sağlamak, onları teknoloji çağına hazırlamak ve istihdam edilebilirliklerini artırmak amacıyla hayata geçirilmiştir.
            </p>
            
            <div className="flex gap-6 mt-10">
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 flex-1 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">🎯</div>
                <span className="block font-bold text-blue-900 text-lg">Vizyon</span>
                <span className="text-sm text-gray-500 mt-2 block">Teknoloji üreten, kendine güvenen bir gençlik.</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-100 border border-orange-50 flex-1 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">🚀</div>
                <span className="block font-bold text-orange-900 text-lg">Misyon</span>
                <span className="text-sm text-gray-500 mt-2 block">Sektörün aradığı nitelikli iş gücünü yaratmak.</span>
              </div>
            </div>
          </div>

          {/* Sağ: Resimler - Oval Köşeler */}
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 transform hover:scale-[1.02] transition duration-500">
              <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop" alt="Proje Amacı" className="w-full h-auto object-cover" />
            </div>
            {/* Dekoratif Daireler (Taşmaya sebep olan bunlardı, şimdi gizlenecekler) */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </section>

      {/* 3. GALERİ - YUVARLAK HATLAR */}
      <section className="py-20 bg-white rounded-[3rem] mx-4 md:mx-10 shadow-sm border border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs bg-blue-50 px-3 py-1 rounded-full">ALBÜM</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-4">Faaliyetlerimizden Kareler</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
            ].map((img, i) => (
              <div key={i} className="h-72 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={`Faaliyet ${i}`} />
                
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/medya" className="inline-block px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:border-blue-600 hover:bg-blue-600 hover:text-white transition duration-300">
              Tüm Albümü Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EĞİTİM PROGRAMLARI - MODERN KARTLAR */}
      <section id="egitimler" className="py-24 container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-12 text-center">Eğitim Programları</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {egitimler?.map((egitim) => (
            <div key={egitim.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 flex flex-col h-full">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <span className="block text-sm font-medium opacity-80 uppercase tracking-widest mb-1">{egitim.kategori}</span>
                <h3 className="font-bold text-2xl mt-1 leading-tight">{egitim.ad}</h3>
                <span className="inline-block mt-4 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                   📅 {new Date(egitim.baslangic_tarihi).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                  {egitim.aciklama.substring(0, 120)}...
                </p>
                <Link href={`/egitimler/${egitim.id}`} className="block w-full text-center py-4 bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-800 font-bold rounded-2xl transition shadow-sm hover:shadow-orange-200">
                  İNCELE & BAŞVUR
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DUYURULAR - CAM EFEKTİ */}
      <section id="duyurular" className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Arka plan süsleri */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center">Güncel Duyurular</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {duyurular?.map((duyuru) => (
               <div key={duyuru.id} className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-md border border-white/10 hover:bg-white/20 transition group cursor-pointer">
                 <div className="flex items-center gap-2 mb-4">
                   <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                   <span className="text-orange-300 text-xs font-bold uppercase tracking-wide">
                     {new Date(duyuru.created_at).toLocaleDateString('tr-TR')}
                   </span>
                 </div>
                 <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-orange-200 transition">{duyuru.baslik}</h3>
                 <p className="text-blue-100 text-sm line-clamp-3 mb-6 leading-relaxed opacity-80">{duyuru.icerik}</p>
                 <button className="text-white font-bold text-sm bg-white/10 px-4 py-2 rounded-full group-hover:bg-orange-500 transition">OKU →</button>
               </div>
             ))}
          </div>
        </div>
      </section>

    </div>
  );
}
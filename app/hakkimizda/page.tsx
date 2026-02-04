import Image from "next/image";

export default function HakkimizdaPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Üst Banner Alanı */}
      <div className="bg-blue-900 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Proje Hakkında</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Gençlerin potansiyelini açığa çıkarmak ve onları geleceğin mesleklerine hazırlamak için buradayız.
        </p>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Sol: Görsel */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
            {/* Buraya gerçek bir resim koymak istersen src kısmını değiştirebilirsin */}
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
              alt="Ekip Çalışması" 
              className="object-cover w-full h-full"
            />
          </div>

          {/* Sağ: Metin */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
              Projenin Amacı
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Yetkin Gençler Projesi, NEET (Ne eğitimde ne istihdamda olan) gençlerin genel, sosyal ve mesleki beceri ve yetkinliklerini geliştirerek mevcut işgücü piyasasının ihtiyaçlarına uygun olarak istihdamını arttırmayı hedeflemektedir.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Teknoloji odaklı eğitimlerimizle, gençleri sadece iş arayan değil, değer üreten bireyler haline getirmeyi amaçlıyoruz. Kapaklı Belediyesi öncülüğünde yürütülen bu proje, bölgesel kalkınmaya nitelikli insan kaynağı ile destek vermektedir.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <span className="block text-3xl font-bold text-blue-600 mb-1">500+</span>
                <span className="text-sm text-gray-600">Mezun Genç</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <span className="block text-3xl font-bold text-green-600 mb-1">%85</span>
                <span className="text-sm text-gray-600">İstihdam Oranı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hedef Kitle Bölümü */}
        <div className="bg-gray-50 rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Hedef Kitlemiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🎓</div>
              <h3 className="font-bold mb-2">15-29 Yaş Arası</h3>
              <p className="text-gray-500 text-sm">Genç nüfusun dinamizmini iş hayatına kazandırmayı hedefliyoruz.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">💼</div>
              <h3 className="font-bold mb-2">İş Arayanlar</h3>
              <p className="text-gray-500 text-sm">Aktif olarak iş arayan ancak yetkinlik eksiği hisseden gençler.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🚀</div>
              <h3 className="font-bold mb-2">Girişimci Adayları</h3>
              <p className="text-gray-500 text-sm">Kendi işini kurmak isteyen yaratıcı zihinler.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
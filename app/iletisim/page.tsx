"use client";
import { useState } from "react";

export default function IletisimPage() {
  // Basit bir form gönderildi mesajı için state
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Buraya ileride Supabase kayıt kodu eklenebilir.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-12">Bize Ulaşın</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          
          {/* İletişim Bilgileri */}
          <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
              <p className="text-blue-200 mb-8">
                Projeyle ilgili sorularınız, iş birlikleri veya başvuru süreçleri hakkında bilgi almak için bize ulaşabilirsiniz.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-bold">Adres</h3>
                    <p className="text-blue-200 text-sm">
                      Lüleburgaz Yıldızları Kadın Akademisi<br/>
                      Sevgi Mahallesi, İstasyon Caddesi, No: 114<br/>
                      Lüleburgaz / Kırklareli
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-bold">Telefon</h3>
                    <p className="text-blue-200 text-sm">0 (288) 417 10 12</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <h3 className="font-bold">E-posta</h3>
                    <p className="text-blue-200 text-sm">project@luleburgaz.bel.tr</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-blue-800">
              <p className="text-sm text-blue-300">Çalışma Saatleri: Hafta içi 08:30 - 17:30</p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Adınız..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                  <input type="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="ornek@mail.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
                    <option>Genel Bilgi</option>
                    <option>Eğitim Başvurusu</option>
                    <option>İş Birliği</option>
                    <option>Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                  <textarea required rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Mesajınızı buraya yazın..."></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Mesajı Gönder
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mesajınız Alındı!</h3>
                <p className="text-gray-600 mb-8">En kısa sürede size dönüş yapacağız.</p>
                <button onClick={() => setSubmitted(false)} className="text-blue-600 font-semibold hover:underline">
                  Yeni mesaj gönder
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
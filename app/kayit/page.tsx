"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KayitPage() {
  // Adım Kontrolü (1: Kayıt Formu, 2: Kod Doğrulama)
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(""); // Kullanıcının gireceği kod
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // 1. ADIM: KAYIT OLMA İSTEĞİ GÖNDER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Eğer otomatik giriş yapılmışsa (Supabase ayarına göre) direkt yönlendir
      if (data.session) {
        router.push("/profil");
      } else {
        // Oturum yoksa doğrulama kodunu bekle
        setStep(2); // 2. Adıma geç
        setLoading(false);
      }
    }
  };

  // 2. ADIM: KODU DOĞRULA
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup'
    });

    if (error) {
      setError("Hatalı kod! Lütfen tekrar deneyin. (" + error.message + ")");
      setLoading(false);
    } else {
      // Başarılı!
      alert("Hesabınız başarıyla doğrulandı! Yönlendiriliyorsunuz...");
      router.push("/profil");
      router.refresh(); // Navbar güncellensin diye
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
        
        {/* HATA MESAJI */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm font-medium border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {step === 1 ? (
          /* --- ADIM 1: KAYIT FORMU --- */
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Hesap Oluştur</h2>
              <p className="mt-2 text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris" className="font-medium text-blue-600 hover:text-blue-500">
                  Giriş Yap
                </Link>
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "İşleniyor..." : "Kayıt Ol ve Kod Gönder"}
              </button>
            </form>
          </>
        ) : (
          /* --- ADIM 2: DOĞRULAMA KODU --- */
          <>
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                📩
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kodu Girin</h2>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-bold text-gray-800">{email}</span> adresine 6 haneli bir kod gönderdik. Lütfen onu aşağıya yazın.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Doğrulama Kodu</label>
                <input
                  type="text"
                  required
                  className="text-center text-2xl tracking-widest block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Doğrulanıyor..." : "Doğrula ve Giriş Yap"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline mt-2"
              >
                E-postayı yanlış mı yazdım? Geri Dön
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
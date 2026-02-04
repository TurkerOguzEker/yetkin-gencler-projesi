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
  const [confirmPassword, setConfirmPassword] = useState(""); // Yeni: Şifre Tekrarı
  const [showPassword, setShowPassword] = useState(false); // Yeni: Şifre Göster/Gizle Durumu

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // 1. ADIM: KAYIT OLMA İSTEĞİ GÖNDER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Şifre Eşleşme Kontrolü 🔒
    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor!");
      return;
    }

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (data.session) {
        router.push("/profil");
      } else {
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

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup'
    });

    if (error) {
      setError("Hatalı kod! (" + error.message + ")");
      setLoading(false);
    } else {
      alert("Doğrulama başarılı! Yönlendiriliyorsunuz...");
      router.push("/profil");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
        
        {/* HATA MESAJI KUTUSU */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm font-medium border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
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
            
            <form className="space-y-5" onSubmit={handleRegister}>
              {/* E-posta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Şifre Alanı */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition-colors"
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Göster/Gizle Butonu */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      // Gözü Kapat İkonu
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      // Gözü Aç İkonu
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Şifre Tekrar Alanı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Üstteki butona bağlı olarak bu da değişir
                    required
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      confirmPassword && password !== confirmPassword 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Şifrenizi tekrar girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {/* Anlık Eşleşme Mesajı */}
                {confirmPassword && password !== confirmPassword && (
                   <p className="text-xs text-red-500 mt-1">Şifreler eşleşmiyor.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition transform hover:-translate-y-0.5"
              >
                {loading ? "İşleniyor..." : "Kayıt Ol ve Kod Gönder"}
              </button>
            </form>
          </>
        ) : (
          /* --- ADIM 2: DOĞRULAMA KODU --- */
          <>
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4 animate-pulse">
                📩
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kodu Girin</h2>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-bold text-gray-800">{email}</span> adresine bir doğrulama kodu gönderdik.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Doğrulama Kodu</label>
                <input
                  type="text"
                  required
                  className="text-center text-3xl tracking-[0.5em] font-bold block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="******"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
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
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SifremiUnuttumPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Kod, 3: Yeni Şifre
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. ADIM: SIFIRLAMA KODU GÖNDER
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep(2); // Kod ekranına geç
      setLoading(false);
    }
  };

  // 2. ADIM: KODU DOĞRULA
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Recovery tipinde doğrulama yapıyoruz
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery'
    });

    if (error) {
      setError("Kod hatalı veya süresi dolmuş. (" + error.message + ")");
      setLoading(false);
    } else {
      // Doğrulama başarılıysa kullanıcı şu an "giriş yapmış" sayılır.
      // Şimdi yeni şifreyi sorabiliriz.
      setStep(3); 
      setLoading(false);
    }
  };

  // 3. ADIM: YENİ ŞİFREYİ KAYDET
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError("Şifre güncellenemedi: " + error.message);
      setLoading(false);
    } else {
      alert("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz.");
      router.push("/giris");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          {step === 1 && "Şifre Sıfırlama"}
          {step === 2 && "Doğrulama Kodu"}
          {step === 3 && "Yeni Şifre Belirle"}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* --- ADIM 1: EMAIL FORMU --- */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <p className="text-sm text-gray-600 text-center">
              Hesabınıza kayıtlı e-posta adresinizi girin. Size bir doğrulama kodu göndereceğiz.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Kod Gönder"}
            </button>
            <div className="text-center mt-4">
               <Link href="/giris" className="text-sm text-gray-500 hover:underline">Giriş sayfasına dön</Link>
            </div>
          </form>
        )}

        {/* --- ADIM 2: KOD DOĞRULAMA --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
             <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-2">📩</div>
              <p className="text-sm text-gray-600">
                <span className="font-bold">{email}</span> adresine gelen 6 haneli kodu girin.
              </p>
            </div>
            <div>
              <input
              type="text"
              required
              className="text-center text-2xl tracking-widest w-full px-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="12345678"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
/>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Doğrulanıyor..." : "Doğrula"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-gray-500 hover:underline mt-2"
            >
              E-postayı değiştir
            </button>
          </form>
        )}

        {/* --- ADIM 3: YENİ ŞİFRE --- */}
        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <p className="text-sm text-green-600 text-center font-medium bg-green-50 p-2 rounded">
              Kod doğrulandı! Lütfen yeni şifrenizi belirleyin.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
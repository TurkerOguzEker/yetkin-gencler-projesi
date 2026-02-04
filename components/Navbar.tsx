"use client"; // Bu satır şart çünkü kullanıcının tarayıcısında çalışacak
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Sayfa yüklendiğinde kullanıcı var mı kontrol et
  useEffect(() => {
    // 1. Mevcut oturumu al
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // 2. Oturum değişikliklerini dinle (Giriş/Çıkış yapıldığında tetiklenir)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Çıkış yapınca ana sayfaya at
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              Y
            </div>
            <span className="text-xl font-bold text-gray-800">Yetkin Gençler</span>
          </Link>

          {/* MENÜ (Masaüstü) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Ana Sayfa</Link>
            <Link href="/hakkimizda" className="text-gray-600 hover:text-blue-600 font-medium transition">Hakkımızda</Link>
            <Link href="/egitimler" className="text-gray-600 hover:text-blue-600 font-medium transition">Eğitimler</Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-blue-600 font-medium transition">İletişim</Link>
            
            <div className="border-l pl-6 flex items-center gap-3">
              {user ? (
                // KULLANICI GİRİŞ YAPMIŞSA
                <>
                  <Link href="/profil" className="text-blue-600 font-semibold hover:underline">
                    Hesabım
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-full hover:bg-red-50">
                    Çıkış
                  </button>
                </>
              ) : (
                // KULLANICI GİRİŞ YAPMAMIŞSA
                <>
                  <Link href="/giris" className="text-gray-600 hover:text-blue-600 font-medium">Giriş Yap</Link>
                  <Link href="/kayit" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm">
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
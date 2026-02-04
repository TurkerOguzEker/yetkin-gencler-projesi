"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinkStyle = (path: string) => 
    `text-sm font-bold uppercase tracking-wide transition-all duration-300 px-3 py-1 rounded-full ${
      pathname === path ? "text-blue-700 bg-blue-50" : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
    }`;

  return (
    // BURADAKİ bg-white/90 ve backdrop-blur KALDIRILDI -> Sadece bg-white
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm font-sans transition-all">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-2xl font-bold text-2xl shadow-lg shadow-blue-200 group-hover:scale-105 transition duration-300">
              Y
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-blue-900 uppercase tracking-tighter group-hover:text-blue-700 transition">Yetkin Gençler</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-[0.25em] uppercase group-hover:text-orange-500 transition">Kapaklı</span>
            </div>
          </Link>

          {/* MENÜ */}
          <div className="hidden xl:flex items-center space-x-2">
            <Link href="/" className={navLinkStyle('/')}>ANASAYFA</Link>
            <Link href="/hakkimizda" className={navLinkStyle('/hakkimizda')}>PROJE HAKKINDA</Link>
            <Link href="/faaliyetler" className={navLinkStyle('/faaliyetler')}>FAALİYETLER</Link>
            <Link href="/egitimler" className={navLinkStyle('/egitimler')}>EĞİTİMLER</Link>
            <Link href="/dokumanlar" className={navLinkStyle('/dokumanlar')}>DOKÜMANLAR</Link>
            <Link href="/medya" className={navLinkStyle('/medya')}>GALERİ</Link>
            <Link href="/#duyurular" className={navLinkStyle('/duyurular')}>DUYURULAR</Link>
          </div>

          {/* SAĞ TARAF */}
          <div className="hidden lg:flex items-center gap-3 border-l border-gray-100 pl-6 ml-2">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profil" className="text-sm font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-4 py-2 rounded-full transition">Hesabım</Link>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-bold">Çıkış</button>
              </div>
            ) : (
              <Link href="/giris" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase rounded-full shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition duration-300">
                GİRİŞ YAP
              </Link>
            )}
          </div>

          {/* MOBİL BUTON */}
          <button className="xl:hidden p-2 rounded-xl hover:bg-gray-100 transition" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t py-6 px-6 shadow-2xl absolute w-full z-40 rounded-b-3xl">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="font-bold text-gray-700 py-2 border-b border-gray-50">ANASAYFA</Link>
            <Link href="/hakkimizda" className="font-bold text-gray-700 py-2 border-b border-gray-50">PROJE HAKKINDA</Link>
            <Link href="/egitimler" className="font-bold text-gray-700 py-2 border-b border-gray-50">EĞİTİM PROGRAMLARI</Link>
            <Link href="/giris" className="block text-center bg-orange-500 text-white py-3 rounded-full font-bold shadow-lg mt-4">GİRİŞ / KAYIT</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
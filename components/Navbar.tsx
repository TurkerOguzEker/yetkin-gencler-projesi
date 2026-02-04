import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO ALANI */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              Y
            </div>
            <span className="text-xl font-bold text-gray-800">Yetkin Gençler</span>
          </Link>

          {/* MENÜ LİNKLERİ (Masaüstü) */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Ana Sayfa
            </Link>
            <Link href="/hakkimizda" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Proje Hakkında
            </Link>
            <Link href="/egitimler" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Eğitimler
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-blue-600 font-medium transition">
              İletişim
            </Link>
          </div>

          {/* SAĞ TARAF BUTON (Admin Girişi için Hazırlık) */}
          <Link 
            href="/admin" 
            className="hidden md:block px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
          >
            Yönetim Paneli
          </Link>
        </div>
      </div>
    </nav>
  );
}
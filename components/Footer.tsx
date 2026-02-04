export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Bölüm 1 */}
        <div>
          <h3 className="text-xl font-bold mb-4">Yetkin Gençler</h3>
          <p className="text-slate-400 text-sm">
            Gençlerin mesleki ve sosyal becerilerini geliştirerek istihdama katılmalarını sağlayan yenilikçi bir platform.
          </p>
        </div>

        {/* Bölüm 2 - Hızlı Linkler */}
        <div>
          <h3 className="text-lg font-bold mb-4">Hızlı Erişim</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-white">Eğitim Programları</a></li>
            <li><a href="#" className="hover:text-white">Duyurular</a></li>
            <li><a href="#" className="hover:text-white">Başarı Öyküleri</a></li>
          </ul>
        </div>

        {/* Bölüm 3 - İletişim */}
        <div>
          <h3 className="text-lg font-bold mb-4">İletişim</h3>
          <p className="text-slate-400 text-sm">Kapaklı Yıldızları Kadın Akademisi</p>
          <p className="text-slate-400 text-sm mt-2">info@yetkingencler.com</p>
        </div>
      </div>
      
      <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
        © 2026 Tüm Hakları Saklıdır.
      </div>
    </footer>
  );
}
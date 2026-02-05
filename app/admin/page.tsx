import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// BU SATIR ÇOK ÖNEMLİ: Sayfanın önbelleğe alınmasını engeller, her girişte taze kontrol yapar.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Next.js 15+ için cookies() asenkron çağrılmalıdır.
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // Server Component içinde cookie set edilmesine gerek yok
          } catch {}
        },
      },
    }
  )

  // 1. Kullanıcı Giriş Yapmış mı?
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    // Kullanıcı yoksa giriş sayfasına at
    redirect('/giris')
  }

  // 2. Kullanıcı "Admin" Yetkisine Sahip mi?
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Eğer profil yoksa veya rolü 'admin' değilse ana sayfaya at
  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // --- BURASI GÜVENLİ ADMIN ALANI ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Üst Başlık */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
            <p className="text-gray-500">Hoş geldin, {user.email}</p>
          </div>
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold transition">
             ← Siteye Dön
          </Link>
        </div>

        {/* Panel İçeriği */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Eğitim Yönetimi</h2>
            <p className="text-gray-600 mb-4 text-sm">Yeni eğitim ekleyin veya mevcutları düzenleyin.</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
              Eğitim Ekle +
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-orange-900 mb-4">Başvurular</h2>
            <p className="text-gray-600 mb-4 text-sm">Gelen eğitim başvurularını inceleyin.</p>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition">
              Listeyi Gör
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-green-900 mb-4">Duyurular</h2>
            <p className="text-gray-600 mb-4 text-sm">Siteye yeni duyuru veya haber girin.</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
              Duyuru Ekle +
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-400">
          İstatistikler ve Grafikler buraya eklenebilir.
        </div>
      </div>
    </div>
  )
}
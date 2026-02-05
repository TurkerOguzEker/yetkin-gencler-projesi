import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try {} catch {} },
      },
    }
  )

  // 1. Güvenlik Kontrolü
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/giris')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Üst Başlık */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
            <p className="text-gray-500">Yetkili: {user.email}</p>
          </div>
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold transition">
             ← Siteye Dön
          </Link>
        </div>

        {/* Panel Menüsü */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* EĞİTİM YÖNETİMİ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-bold text-blue-900 mb-2">🎓 Eğitimler</h2>
            <p className="text-gray-600 mb-6 text-sm">Eğitim programlarını ekle, düzenle veya sil.</p>
            <Link 
              href="/admin/egitimler" 
              className="block w-full text-center bg-blue-100 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition"
            >
              Eğitimleri Yönet →
            </Link>
          </div>

          {/* DUYURU YÖNETİMİ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-bold text-green-900 mb-2">📢 Duyurular</h2>
            <p className="text-gray-600 mb-6 text-sm">Siteye yeni haber ve duyuru girişi yap.</p>
            <Link 
              href="/admin/duyurular" 
              className="block w-full text-center bg-green-100 text-green-700 py-3 rounded-xl font-bold hover:bg-green-600 hover:text-white transition"
            >
              Duyuruları Yönet →
            </Link>
          </div>

          {/* BAŞVURULAR (Sadece İzleme) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-bold text-orange-900 mb-2">📝 Başvurular</h2>
            <p className="text-gray-600 mb-6 text-sm">Gelen öğrenci başvurularını incele.</p>
            <button className="w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition">
              Listeyi Gör (Yakında)
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
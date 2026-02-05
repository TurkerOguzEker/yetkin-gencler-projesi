import { createBrowserClient } from '@supabase/ssr'

// "createBrowserClient" fonksiyonu, giriş yapıldığında 
// oturum bilgisini otomatik olarak Çerezlere (Cookie) yazar.
// Böylece Admin paneli (Sunucu) sizi tanıyabilir.

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Sadece /admin ile başlayan yolları kontrol et
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    // Tarayıcıdan gelen yetki bilgisini al
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // Kullanıcı adı ve şifreyi çöz (base64)
      const [user, pwd] = atob(authValue).split(':');

      // .env dosyasındaki bilgilerle eşleşiyor mu?
      if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next(); // Geçiş izni ver
      }
    }

    // Eşleşmezse veya bilgi yoksa giriş penceresi aç
    url.pathname = '/api/auth';
    return new NextResponse('Giriş Yetkisi Gerekli', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

// Hangi yollarda çalışacağını belirtiyoruz
export const config = {
  matcher: ['/admin/:path*'],
};
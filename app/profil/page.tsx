"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/giris"); // Giriş yapmamışsa login sayfasına at
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  if (!user) return <div className="text-center p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hesabım</h1>

        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.email}</h2>
              <p className="text-gray-500 text-sm">Üye</p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-bold text-lg mb-4">Eğitim Durumu</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded border border-dashed border-gray-300 text-center">
              Henüz bir eğitime kayıt olmadınız. 
              <br />
              <Link href="/egitimler" className="text-blue-600 font-semibold mt-2 inline-block hover:underline">
                Eğitimleri İncele →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
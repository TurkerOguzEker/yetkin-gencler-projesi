"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function BasvuruButonu({ egitimId }: { egitimId: number }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "already_applied" | "error">("idle");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Kullanıcı daha önce başvurmuş mu kontrol et
        const { data } = await supabase
          .from('basvurular')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('egitim_id', egitimId)
          .single();

        if (data) setStatus("already_applied");
      }
    };
    checkUser();
  }, [egitimId]);

  const handleBasvuru = async () => {
    if (!user) {
      if (confirm("Başvuru yapmak için giriş yapmalısınız. Giriş sayfasına gitmek ister misiniz?")) {
        router.push("/giris");
      }
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('basvurular')
      .insert([{ user_id: user.id, egitim_id: egitimId }]);

    if (error) {
      alert("Hata oluştu: " + error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
    setLoading(false);
  };

  if (status === "already_applied") {
    return (
      <button disabled className="w-full md:w-auto bg-green-100 text-green-700 px-8 py-4 rounded-full font-bold border border-green-200 cursor-default shadow-sm">
        ✓ Başvurunuz Alındı
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full md:w-auto bg-green-500 text-white px-8 py-4 rounded-full font-bold text-center shadow-lg animate-pulse">
        🎉 Başvurunuz Başarılı!
      </div>
    );
  }

  return (
    <button 
      onClick={handleBasvuru} 
      disabled={loading}
      className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-full font-bold transition transform hover:scale-105 shadow-xl hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "İşleniyor..." : "Başvuru Formunu Onayla"}
    </button>
  );
}
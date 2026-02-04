import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  // Veritabanından duyuruları çekiyoruz
  const { data: duyurular, error } = await supabase
    .from('duyurular')
    .select('*');

  if (error) {
    console.error("Hata var:", error);
    return <div>Veri çekilemedi. Konsola bak.</div>;
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Lüleburgaz Yetkin Gençler - Haberler
      </h1>
      
      <div className="grid gap-4">
        {duyurular?.map((duyuru) => (
          <div key={duyuru.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{duyuru.baslik}</h2>
            <p className="text-gray-600">{duyuru.icerik}</p>
            <span className="text-xs text-gray-400">
              {new Date(duyuru.created_at).toLocaleDateString("tr-TR")}
            </span>
          </div>
        ))}
        
        {duyurular?.length === 0 && (
          <p>Henüz hiç duyuru eklenmemiş.</p>
        )}
      </div>
    </main>
  );
}
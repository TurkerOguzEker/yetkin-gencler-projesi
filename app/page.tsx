import { supabase } from "@/lib/supabaseClient";

// 1. ADIM: Veritabanından gelecek verinin tipini tanımlıyoruz
interface Duyuru {
  id: number;
  baslik: string;
  icerik: string;
  created_at: string;
  resim_url?: string; // Soru işareti, bu alanın boş gelebileceğini belirtir
}

export default async function Home() {
  // 2. ADIM: Veriyi çekerken tip güvenliği sağlıyoruz
  const { data, error } = await supabase
    .from('duyurular')
    .select('*');
    
  // Gelen veriyi "Duyuru Dizisi" olarak tanıtıyoruz
  const duyurular = data as Duyuru[] | null;

  if (error) {
    console.error("Hata var:", error);
    return <div className="p-10 text-red-500">Veri çekilemedi: {error.message}</div>;
  }

  return (
    <main className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-600 border-b pb-4">
        Lüleburgaz Yetkin Gençler - Haberler
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {duyurular?.map((duyuru) => (
          <div key={duyuru.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Eğer resim varsa göster */}
            {duyuru.resim_url && (
              <img 
                src={duyuru.resim_url} 
                alt={duyuru.baslik} 
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{duyuru.baslik}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{duyuru.icerik}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-4">
                <span>
                  {new Date(duyuru.created_at).toLocaleDateString("tr-TR", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {(!duyurular || duyurular.length === 0) && (
          <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-lg">Henüz hiç duyuru eklenmemiş.</p>
            <p className="text-sm">Supabase panelinden yeni veri ekleyebilirsiniz.</p>
          </div>
        )}
      </div>
    </main>
  );
}
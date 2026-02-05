"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DuyuruYonetimi() {
  const [duyurular, setDuyurular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ baslik: "", icerik: "" });
  const router = useRouter();

  useEffect(() => {
    fetchDuyurular();
  }, []);

  const fetchDuyurular = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }

    const { data } = await supabase.from("duyurular").select("*").order("created_at", { ascending: false });
    if (data) setDuyurular(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.baslik || !form.icerik) return alert("Lütfen tüm alanları doldurun.");

    const duyuruData = { baslik: form.baslik, icerik: form.icerik, aktif: true };
    let error;

    if (editingId) {
      const res = await supabase.from("duyurular").update(duyuruData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("duyurular").insert([duyuruData]);
      error = res.error;
    }

    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert(editingId ? "Duyuru güncellendi! ✅" : "Duyuru başarıyla eklendi! 🎉");
      resetForm();
      fetchDuyurular();
    }
  };

  const handleDuzenle = (item: any) => {
    setEditingId(item.id);
    setForm({ baslik: item.baslik, icerik: item.icerik });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ baslik: "", icerik: "" });
  };

  const handleSil = async (id: number) => {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("duyurular").delete().eq("id", id);
    if (!error) fetchDuyurular();
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📢 Duyuru Yönetimi</h1>
            <p className="text-gray-500 text-sm">Sitedeki güncel duyuruları buradan yönetin.</p>
          </div>
          <Link href="/admin" className="text-gray-500 hover:text-blue-600 px-4 py-2 bg-white rounded-lg border border-gray-200 transition">
            ← Panele Dön
          </Link>
        </div>

        {/* --- FORM (Eğitim Paneli ile Aynı Tasarım) --- */}
        <div className={`p-8 rounded-2xl shadow-sm border mb-10 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-blue-900">
              {editingId ? "✏️ Duyuruyu Düzenle" : "➕ Yeni Duyuru Yayınla"}
            </h2>
            {editingId && <button onClick={resetForm} className="text-sm text-red-500 font-bold hover:underline">İptal Et</button>}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duyuru Başlığı *</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: Başvuru Sonuçları Açıklandı"
                value={form.baslik}
                onChange={(e) => setForm({...form, baslik: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duyuru İçeriği *</label>
              <textarea 
                rows={5}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Duyuru detaylarını buraya yazın..."
                value={form.icerik}
                onChange={(e) => setForm({...form, icerik: e.target.value})}
              />
            </div>
            <button type="submit" className={`w-full text-white px-6 py-4 rounded-xl font-bold shadow-lg transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? "💾 Değişiklikleri Kaydet" : "+ Duyuruyu Yayınla"}
            </button>
          </form>
        </div>

        {/* --- LİSTE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-700">Aktif Duyurular ({duyurular.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {duyurular.map((item) => (
              <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition">
                <div className="flex-1">
                  <span className="text-gray-400 text-xs font-medium block mb-1">📅 {new Date(item.created_at).toLocaleDateString("tr-TR")}</span>
                  <h4 className="font-bold text-lg text-gray-800">{item.baslik}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.icerik}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleDuzenle(item)} className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-lg text-sm font-bold hover:bg-yellow-500 hover:text-white transition">✏️ Düzenle</button>
                  <button onClick={() => handleSil(item.id)} className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition">🗑️ Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
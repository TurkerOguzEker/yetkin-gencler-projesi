"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DuyuruYonetimi() {
  const [duyurular, setDuyurular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null); // Düzenleme Modu
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
       // GÜNCELLEME
       const res = await supabase.from("duyurular").update(duyuruData).eq("id", editingId);
       error = res.error;
    } else {
       // EKLEME
       const res = await supabase.from("duyurular").insert([duyuruData]);
       error = res.error;
    }

    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert(editingId ? "Duyuru güncellendi!" : "Duyuru eklendi!");
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
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("duyurular").delete().eq("id", id);
    if (!error) fetchDuyurular();
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">📢 Duyuru Yönetimi</h1>
            <Link href="/admin" className="text-gray-500 hover:text-blue-600 bg-white border px-4 py-2 rounded-lg">← Panele Dön</Link>
        </div>

        {/* --- FORM --- */}
        <div className={`p-6 rounded-2xl shadow-sm border mb-10 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-blue-900">{editingId ? "✏️ Duyuruyu Düzenle" : "➕ Yeni Duyuru Ekle"}</h2>
            {editingId && <button onClick={resetForm} className="text-red-500 text-sm font-bold">İptal</button>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Başlık</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-lg" value={form.baslik} onChange={(e) => setForm({...form, baslik: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">İçerik</label>
              <textarea rows={3} className="w-full border border-gray-300 p-3 rounded-lg" value={form.icerik} onChange={(e) => setForm({...form, icerik: e.target.value})} />
            </div>
            <button type="submit" className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
               {editingId ? "💾 Değişiklikleri Kaydet" : "+ Yayınla"}
            </button>
          </form>
        </div>

        {/* --- LİSTE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {duyurular.map((item) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between gap-4 hover:bg-gray-50 transition">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{item.baslik}</h4>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.icerik}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDuzenle(item)} className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500 hover:text-white transition">✏️ Düzenle</button>
                    <button onClick={() => handleSil(item.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition">🗑️ Sil</button>
                  </div>
                </div>
              ))}
            </div>
        </div>

      </div>
    </div>
  );
}
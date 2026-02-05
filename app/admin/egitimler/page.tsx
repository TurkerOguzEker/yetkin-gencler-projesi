"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EgitimYonetimi() {
  const [egitimler, setEgitimler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Resim yüklenme durumu
  
  // Düzenleme modu için state
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    ad: "",
    kategori: "",
    baslangic_tarihi: "",
    kontenjan: "",
    aciklama: "",
    resim_url: ""
  });
  
  // Seçilen resim dosyası için state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchEgitimler();
  }, []);

  const fetchEgitimler = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }

    const { data } = await supabase
      .from("egitimler")
      .select("*")
      .order("baslangic_tarihi", { ascending: true });

    if (data) setEgitimler(data);
    setLoading(false);
  };

  // Resim Yükleme Fonksiyonu
  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 'egitim-gorselleri' bucket'ına yükle
      const { error: uploadError } = await supabase.storage
        .from('egitim-gorselleri')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Public URL'i al
      const { data } = supabase.storage
        .from('egitim-gorselleri')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      alert('Resim yüklenirken hata oluştu: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ad || !form.baslangic_tarihi || !form.kontenjan) {
      alert("Lütfen zorunlu alanları doldurun (*)");
      return;
    }

    let finalResimUrl = form.resim_url;

    // Eğer yeni bir resim seçildiyse önce onu yükle
    if (selectedImage) {
      const uploadedUrl = await uploadImage(selectedImage);
      if (uploadedUrl) {
        finalResimUrl = uploadedUrl;
      } else {
        return; // Yükleme başarısızsa dur
      }
    }

    const egitimData = {
      ad: form.ad,
      kategori: form.kategori || "Genel",
      baslangic_tarihi: form.baslangic_tarihi,
      kontenjan: parseInt(form.kontenjan),
      aciklama: form.aciklama,
      resim_url: finalResimUrl, // Resim URL'ini kaydet
      aktif: true
    };

    let error;

    if (editingId) {
      // --- GÜNCELLEME ---
      const res = await supabase
        .from("egitimler")
        .update(egitimData)
        .eq("id", editingId);
      error = res.error;
    } else {
      // --- EKLEME ---
      const res = await supabase
        .from("egitimler")
        .insert([egitimData]);
      error = res.error;
    }

    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert(editingId ? "Eğitim güncellendi! ✅" : "Eğitim başarıyla oluşturuldu! 🎉");
      resetForm();
      fetchEgitimler();
    }
  };

  const handleDuzenle = (item: any) => {
    setEditingId(item.id);
    setForm({
      ad: item.ad,
      kategori: item.kategori,
      baslangic_tarihi: item.baslangic_tarihi,
      kontenjan: item.kontenjan.toString(),
      aciklama: item.aciklama,
      resim_url: item.resim_url || ""
    });
    setSelectedImage(null); // Resim seçimini sıfırla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ad: "", kategori: "", baslangic_tarihi: "", kontenjan: "", aciklama: "", resim_url: "" });
    setSelectedImage(null);
  };

  const handleSil = async (id: number) => {
    if (!confirm("Bu eğitimi silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("egitimler").delete().eq("id", id);
    if (!error) fetchEgitimler();
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">🎓 Eğitim Yönetimi</h1>
            <Link href="/admin" className="text-gray-500 hover:text-blue-600 px-4 py-2 border rounded-lg bg-white">← Panele Dön</Link>
        </div>

        {/* --- FORM --- */}
        <div className={`p-8 rounded-2xl shadow-sm border mb-10 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-blue-900">
              {editingId ? "✏️ Eğitimi Düzenle" : "➕ Yeni Eğitim Oluştur"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-red-500 font-bold hover:underline">
                İptal Et
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Eğitim Adı *</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-lg" value={form.ad} onChange={(e) => setForm({...form, ad: e.target.value})} />
            </div>

            {/* --- RESİM YÜKLEME ALANI --- */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Eğitim Görseli</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {form.resim_url && !selectedImage && (
                  <div className="text-sm text-green-600 font-medium">Mevcut resim korunacak</div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
              <select className="w-full border border-gray-300 p-3 rounded-lg bg-white" value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})}>
                <option value="">Seçiniz...</option>
                <option value="Yazılım">Yazılım & Kodlama</option>
                <option value="Tasarım">Tasarım & Medya</option>
                <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                <option value="Yabancı Dil">Yabancı Dil</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Başlangıç Tarihi *</label>
              <input type="date" className="w-full border border-gray-300 p-3 rounded-lg" value={form.baslangic_tarihi} onChange={(e) => setForm({...form, baslangic_tarihi: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kontenjan *</label>
              <input type="number" className="w-full border border-gray-300 p-3 rounded-lg" value={form.kontenjan} onChange={(e) => setForm({...form, kontenjan: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Açıklama</label>
              <textarea rows={4} className="w-full border border-gray-300 p-3 rounded-lg" value={form.aciklama} onChange={(e) => setForm({...form, aciklama: e.target.value})} />
            </div>
            
            <button 
              type="submit" 
              disabled={uploading}
              className={`md:col-span-2 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
            >
              {uploading ? "Resim Yükleniyor..." : (editingId ? "💾 Değişiklikleri Kaydet" : "+ Eğitimi Yayınla")}
            </button>
          </form>
        </div>

        {/* --- LİSTE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {egitimler.map((item) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Resim Önizleme */}
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border">
                      {item.resim_url ? (
                        <img src={item.resim_url} alt={item.ad} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🎓</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{item.kategori}</span>
                          <span className="text-gray-400 text-xs font-medium">📅 {new Date(item.baslangic_tarihi).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">{item.ad}</h4>
                      <span className="text-sm text-gray-500">Kontenjan: {item.kontenjan}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDuzenle(item)}
                      className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-lg text-sm font-bold hover:bg-yellow-500 hover:text-white transition"
                    >
                      ✏️ Düzenle
                    </button>
                    <button onClick={() => handleSil(item.id)} className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition">
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
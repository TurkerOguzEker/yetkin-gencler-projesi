"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("duyuru");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Veri Listeleri
  const [duyuruList, setDuyuruList] = useState<any[]>([]);
  const [egitimList, setEgitimList] = useState<any[]>([]);
  
  // Düzenleme Modu (Hangi ID düzenleniyor?)
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Duyuru Form State
  const [duyuruBaslik, setDuyuruBaslik] = useState("");
  const [duyuruIcerik, setDuyuruIcerik] = useState("");
  const [duyuruResim, setDuyuruResim] = useState("");

  // Eğitim Form State
  const [egitimAd, setEgitimAd] = useState("");
  const [egitimAciklama, setEgitimAciklama] = useState("");
  const [egitimKategori, setEgitimKategori] = useState("Genel");
  const [egitimTarih, setEgitimTarih] = useState("");
  const [egitimKontenjan, setEgitimKontenjan] = useState(0);

  // 1. Sayfa Yüklenirken Verileri Çek
  useEffect(() => {
    const init = async () => {
      // Oturum Kontrolü
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchData(); // Giriş yapılmışsa verileri getir
      }
    };
    init();
  }, []);

  // VERİLERİ ÇEKME FONKSİYONU
  const fetchData = async () => {
    const { data: duyurular } = await supabase.from('duyurular').select('*').order('id', { ascending: false });
    const { data: egitimler } = await supabase.from('egitimler').select('*').order('id', { ascending: false });
    
    if (duyurular) setDuyuruList(duyurular);
    if (egitimler) setEgitimList(egitimler);
  };

  // GİRİŞ YAP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  // --- İŞLEM FONKSİYONLARI ---

  // FORM SIFIRLAMA
  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setDuyuruBaslik(""); setDuyuruIcerik(""); setDuyuruResim("");
    setEgitimAd(""); setEgitimAciklama(""); setEgitimKontenjan(0); setEgitimTarih("");
    setMessage("");
  };

  // SİLME İŞLEMİ
  const handleDelete = async (table: string, id: number) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      alert("Hata: " + error.message);
    } else {
      fetchData(); // Listeyi güncelle
      alert("Kayıt silindi.");
    }
  };

  // DÜZENLEME MODUNU AÇMA (Verileri Forma Doldur)
  const handleEditClick = (item: any, type: "duyuru" | "egitim") => {
    setEditMode(true);
    setEditId(item.id);
    setActiveTab(type);
    setMessage("Düzenleme Modu Aktif ✏️");

    if (type === "duyuru") {
      setDuyuruBaslik(item.baslik);
      setDuyuruIcerik(item.icerik);
      setDuyuruResim(item.resim_url || "");
    } else {
      setEgitimAd(item.ad);
      setEgitimAciklama(item.aciklama);
      setEgitimKategori(item.kategori);
      setEgitimTarih(item.baslangic_tarihi);
      setEgitimKontenjan(item.kontenjan);
    }
    
    // Sayfanın en üstüne (forma) kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DUYURU KAYDET / GÜNCELLE
  const handleSaveDuyuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("İşleniyor...");

    const veri = { baslik: duyuruBaslik, icerik: duyuruIcerik, resim_url: duyuruResim, aktif: true };
    
    let error;
    if (editMode && editId) {
      // Güncelleme
      const res = await supabase.from('duyurular').update(veri).eq('id', editId);
      error = res.error;
    } else {
      // Yeni Ekleme
      const res = await supabase.from('duyurular').insert([veri]);
      error = res.error;
    }

    if (error) setMessage("Hata: " + error.message);
    else {
      setMessage(editMode ? "✅ Duyuru Güncellendi!" : "✅ Duyuru Eklendi!");
      fetchData();
      resetForm();
    }
  };

  // EĞİTİM KAYDET / GÜNCELLE
  const handleSaveEgitim = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("İşleniyor...");

    const veri = { 
      ad: egitimAd, 
      aciklama: egitimAciklama, 
      kategori: egitimKategori, 
      baslangic_tarihi: egitimTarih, 
      kontenjan: egitimKontenjan 
    };

    let error;
    if (editMode && editId) {
      // Güncelleme
      const res = await supabase.from('egitimler').update(veri).eq('id', editId);
      error = res.error;
    } else {
      // Yeni Ekleme
      const res = await supabase.from('egitimler').insert([veri]);
      error = res.error;
    }

    if (error) setMessage("Hata: " + error.message);
    else {
      setMessage(editMode ? "✅ Eğitim Güncellendi!" : "✅ Eğitim Eklendi!");
      fetchData();
      resetForm();
    }
  };

  // --- GÖRÜNÜM ---
  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Admin Girişi</h2>
        <input className="w-full mb-3 p-2 border rounded" type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded" type="password" placeholder="Şifre" onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>Giriş Yap</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Yönetim Paneli</h1>
          <div className="flex gap-2">
             <button onClick={resetForm} className="text-sm text-gray-500 hover:text-blue-600">Formu Temizle</button>
             <button onClick={() => supabase.auth.signOut().then(()=>window.location.reload())} className="text-red-500 font-bold border px-3 py-1 rounded hover:bg-red-50">Çıkış</button>
          </div>
        </div>

        {/* SEKMELER */}
        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => { setActiveTab("duyuru"); resetForm(); }} className={`pb-2 px-4 ${activeTab === "duyuru" ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-gray-500"}`}>📢 Duyurular</button>
          <button onClick={() => { setActiveTab("egitim"); resetForm(); }} className={`pb-2 px-4 ${activeTab === "egitim" ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-gray-500"}`}>🎓 Eğitimler</button>
        </div>

        {/* FORM ALANI */}
        <div className={`p-6 rounded shadow mb-10 border-l-4 ${editMode ? "bg-yellow-50 border-yellow-400" : "bg-white border-blue-500"}`}>
          <h3 className="font-bold mb-4 text-lg">
            {editMode ? "✏️ Kaydı Düzenle" : (activeTab === "duyuru" ? "➕ Yeni Duyuru Ekle" : "➕ Yeni Eğitim Ekle")}
          </h3>
          
          {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded text-sm font-bold">{message}</div>}

          {activeTab === "duyuru" ? (
            <form onSubmit={handleSaveDuyuru} className="space-y-4">
              <input className="w-full p-2 border rounded" placeholder="Başlık" value={duyuruBaslik} onChange={e=>setDuyuruBaslik(e.target.value)} required />
              <textarea className="w-full p-2 border rounded" rows={3} placeholder="İçerik" value={duyuruIcerik} onChange={e=>setDuyuruIcerik(e.target.value)} required />
              <input className="w-full p-2 border rounded" placeholder="Resim URL" value={duyuruResim} onChange={e=>setDuyuruResim(e.target.value)} />
              <button className={`px-6 py-2 rounded text-white ${editMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                {editMode ? "Güncellemeyi Kaydet" : "Duyuruyu Yayınla"}
              </button>
              {editMode && <button type="button" onClick={resetForm} className="ml-2 text-gray-500 underline">İptal</button>}
            </form>
          ) : (
            <form onSubmit={handleSaveEgitim} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full p-2 border rounded" placeholder="Eğitim Adı" value={egitimAd} onChange={e=>setEgitimAd(e.target.value)} required />
                <select className="w-full p-2 border rounded" value={egitimKategori} onChange={e=>setEgitimKategori(e.target.value)}>
                  <option value="Genel">Genel Beceri</option>
                  <option value="Mesleki">Mesleki Eğitim</option>
                  <option value="Teknoloji">Teknoloji</option>
                </select>
              </div>
              <textarea className="w-full p-2 border rounded" rows={3} placeholder="Açıklama" value={egitimAciklama} onChange={e=>setEgitimAciklama(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="w-full p-2 border rounded" value={egitimTarih} onChange={e=>setEgitimTarih(e.target.value)} required />
                <input type="number" className="w-full p-2 border rounded" placeholder="Kontenjan" value={egitimKontenjan} onChange={e=>setEgitimKontenjan(Number(e.target.value))} />
              </div>
              <button className={`px-6 py-2 rounded text-white ${editMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}>
                {editMode ? "Güncellemeyi Kaydet" : "Eğitimi Oluştur"}
              </button>
              {editMode && <button type="button" onClick={resetForm} className="ml-2 text-gray-500 underline">İptal</button>}
            </form>
          )}
        </div>

        {/* --- LİSTELEME ALANI (TABLO) --- */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-700">📋 Mevcut {activeTab === "duyuru" ? "Duyurular" : "Eğitimler"} Listesi</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Başlık / Ad</th>
                  <th className="p-3 border-b">Tarih</th>
                  <th className="p-3 border-b text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "duyuru" ? duyuruList : egitimList).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3 text-gray-500">#{item.id}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {activeTab === "duyuru" ? item.baslik : item.ad}
                      <div className="text-xs text-gray-400 font-normal truncate max-w-xs">
                         {activeTab === "duyuru" ? item.icerik : item.aciklama}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(item, activeTab as any)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDelete(activeTab === "duyuru" ? 'duyurular' : 'egitimler', item.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                
                {(activeTab === "duyuru" ? duyuruList : egitimList).length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">Henüz veri eklenmemiş.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
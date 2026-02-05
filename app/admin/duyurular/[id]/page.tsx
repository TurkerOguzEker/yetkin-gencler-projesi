import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuyuruDetayPage({ params }: PageProps) {
  const { id } = await params;

  const { data: duyuru } = await supabase
    .from('duyurular')
    .select('*')
    .eq('id', id)
    .single();

  if (!duyuru) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <Link href="/#duyurular" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-bold transition group">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md group-hover:bg-blue-600 group-hover:text-white mr-3 transition">←</span>
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-10 md:p-14 text-white relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 opacity-90">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Duyuru</span>
                <span className="text-sm font-medium">📅 {new Date(duyuru.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{duyuru.baslik}</h1>
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="prose prose-lg text-gray-600 leading-loose whitespace-pre-wrap">
              {duyuru.icerik}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
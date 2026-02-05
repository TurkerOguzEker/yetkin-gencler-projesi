import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yetkin Gençler Projesi",
  description: "Gençler için eğitim ve istihdam platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* suppressHydrationWarning={true} ekleyerek eklenti kaynaklı hataları engelliyoruz */}
      <body 
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
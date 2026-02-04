import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Yeni oluşturduğumuz Navbar
import Footer from "@/components/Footer"; // Yeni oluşturduğumuz Footer

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
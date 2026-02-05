"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
    title: "Geleceğin Yetkin Gençleri",
    subtitle: "Teknoloji ve inovasyon odaklı eğitimlerle kariyerine yön ver.",
    buttonText: "Eğitimleri İncele",
    link: "/egitimler"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
    title: "Proje Hakkında",
    subtitle: "Genç istihdamını destekleyen güçlü bir gelecek vizyonu.",
    buttonText: "Detaylı Bilgi",
    link: "/hakkimizda"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
    title: "Atölye ve Faaliyetler",
    subtitle: "Uygulamalı atölye çalışmaları ile tecrübe kazan.",
    buttonText: "Faaliyetlerimiz",
    link: "/faaliyetler"
  }
];

export default function MainSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Ana kapsayıcı: Arka plan beyaz, alt köşeler yuvarlak
    <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden bg-white rounded-b-[3rem] shadow-xl z-0">
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* --- RESİM ALANI (FİLTRESİZ) --- */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* --- YAZI ALANI --- */}
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start z-10">
            {/* Yazıların okunması için çok hafif bir metin gölgesi (text-shadow) */}
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl text-white mb-10 max-w-2xl font-bold" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
              {slide.subtitle}
            </p>
            
            <Link
              href={slide.link}
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition transform hover:scale-105 shadow-lg"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* --- ALT NOKTALAR --- */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all duration-300 shadow-sm border border-white/20 ${
              index === current ? "bg-orange-500 w-10" : "bg-white/80 w-3 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
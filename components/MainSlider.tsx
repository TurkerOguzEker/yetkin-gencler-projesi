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
    <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden bg-gray-100 rounded-b-[3rem] shadow-2xl z-0">
      {/* Slaytlar */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Arka Plan Resmi - Karartma/Filtre YOK */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear transform scale-105 hover:scale-100"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Buradaki tüm overlay div'leri silindi, sadece saf resim var */}
          </div>

          {/* İçerik */}
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
            {/* Yazıların okunması için güçlü drop-shadow eklendi */}
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)]">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl text-white mb-10 max-w-2xl leading-relaxed drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] font-bold">
              {slide.subtitle}
            </p>
            <Link
              href={slide.link}
              className="w-fit px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition transform hover:scale-105 shadow-xl hover:shadow-orange-500/50"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* Noktalar */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all duration-300 shadow-md ${
              index === current ? "bg-orange-500 w-10" : "bg-white w-3 hover:bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
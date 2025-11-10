"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "/carousal_img.webp",
    caption: "Big Sale — Up to 20% Off!",
  },
  {
    id: 2,
    image: "/carousal_img.webp",
    caption: "New Arrivals for You!",
  },
  {
    id: 3,
    image: "/carousal_img.webp",
    caption: "Discover Our Best Sellers",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(interval);
  },);

  return (
    <div className="relative w-full max-w-8xl mx-auto mt-5 overflow-hidden shadow-lg">
      {/* Slide Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <Image
              src={slide.image}
              alt={slide.caption}
              width={500}
              height={500}
              className="object-cover w-full h-64 md:h-100"
            />
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-2xl md:text-4xl font-semibold">
                {slide.caption}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>

      {/* Left / Right Arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-700 p-2 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-700 p-2 rounded-full"
      >
        ›
      </button>
    </div>
  );
}

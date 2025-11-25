"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const slides = [
  { id: 1, image: "/carousal_img.webp", caption: "Big Sale — Up to 20% Off!" },
  { id: 2, image: "/carousal_img.webp", caption: "New Arrivals for You!" },
  { id: 3, image: "/carousal_img.webp", caption: "Discover Our Best Sellers" },
];

export default function FadeCarousel() {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // START swipe (mouse + touch)
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  // MOVE swipe (event not required)
  const handleMove = () => {
    if (!isDragging.current) return;
  };

  // END swipe (mouse + touch)
  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const endX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;

    const diff = endX - startX.current;

    if (diff > 50) {
      // Swipe Right
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (diff < -50) {
      // Swipe Left
      setCurrent((prev) => (prev + 1) % slides.length);
    }
  };

  return (
    <div
      className="relative w-full h-64 md:h-96 overflow-hidden select-none shadow-lg"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[500ms] ease-in-out ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-semibold">
              {slide.caption}
            </h2>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

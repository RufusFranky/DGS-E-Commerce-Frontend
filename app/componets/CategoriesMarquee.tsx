"use client";
 
import Marquee from "react-fast-marquee";
 
const productCategories = [
  "Brake Pads",
  "Batteries",
  "Bulbs",
  "Wiper Blades",
  "Engine Oils",
];
 
export default function CategoriesMarquee() {
  return (
    <div
      className="w-full overflow-hidden relative flex items-center mt-1"
      style={{
        height: "35px",
        background: "#0c4395",
        textAlign: "center",
      }}
    >
      <Marquee
        gradient={false}
        speed={40}
        pauseOnHover={true}
        autoFill={true}
        className="relative z-10"
      >
        {productCategories.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center"
            style={{
              color: "#ffffff",         // guaranteed white
              padding: "0 22px",        // equal gap for each item
              fontSize: "14px",         // matches text-base roughly
              fontWeight: 400,          // normal weight
              letterSpacing: "0.03em",
            }}
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
 
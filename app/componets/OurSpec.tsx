
import React from "react";
import Image from "next/image";
import { ourSpecsData } from "@/utils/asset";
 
const OurSpecs = () => {
  return (
    <div className="px-6 mb-15 max-w-6xl mx-auto">
 
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Our Specifications
      </h2>
      <p className="text-center text-black gap-5 mb-10">
        We provide genuine, high-quality spare parts that perfectly fit your vehicle.
        Each part is carefully selected to ensure safety, reliability, and optimal performance.
        Shop with confidence knowing you are getting parts built to last.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-10">
        {ourSpecsData.map((spec, index) => {
          return (
            <div
              className="relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group"
              style={{
                backgroundColor: spec.accent + "10",
                borderColor: spec.accent + "30",
              }}
              key={index}
            >
              <h3 className="text-black font-semibold">{spec.title}</h3>
              <p className="text-sm text-black mt-3">{spec.description}</p>
 
              <div
                className="absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition"
                style={{ backgroundColor: spec.accent }}
              >
                <Image
                  src={spec.icon}
                  alt={spec.title}
                  className="w-6 h-6"
                />
              </div>
            </div>
          );
        })}
      </div>
 
    </div>
  );
};
 
export default OurSpecs;

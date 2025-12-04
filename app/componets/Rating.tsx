import { Star } from "lucide-react";
import React from "react";
 
interface RatingProps {
  value?: number;
  productId?: number; // kept for future use, does not affect anything now
}
 
const Rating: React.FC<RatingProps> = ({ value = 4 }) => {
  const ratingValue = Number(value) || 0;
 
  return (
<div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => {
        const isFilled = ratingValue > i;
 
        return (
<Star
            key={i}
            className={`shrink-0 size-4 transition-all
              ${isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            `}
          />
        );
      })}
</div>
  );
};
 
export default Rating;
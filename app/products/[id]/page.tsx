"use client";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

// ✅ Define the props interface
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

// ✅ Component definition
export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* Product layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-lg object-cover shadow-md"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-semibold">Price:</span> ${product.price}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Part Number:</span> {product.part_number}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

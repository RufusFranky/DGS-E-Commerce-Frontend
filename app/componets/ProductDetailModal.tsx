"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import { toastCartAdd } from "@/utils/toast";
import { useUser, SignInButton } from "@clerk/nextjs";  // ✅ Added Clerk

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

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const { isSignedIn } = useUser(); // ✅ Detect login status

  const handleAddToCart = () => {
    if (!isSignedIn) return; // Block unauthorized
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      part_number: product.part_number,
      image: product.image,
      quantity: 1,
    });

    toastCartAdd(product.name, 1);
  };

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
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer transition"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-lg object-cover shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* 🔒 Price visibility rule */}
            {!isSignedIn ? (
              <p className="text-red-600 font-semibold mb-2">
                Login to view price
              </p>
            ) : (
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-semibold">Price:</span> ${product.price}
              </p>
            )}

            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>

            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Part Number:</span> {product.part_number}
            </p>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">

              {/* 🔒 Login Required Button (opens Clerk modal) */}
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-1 px-5 rounded-lg transition cursor-pointer">
                    Login required
                  </button>
                </SignInButton>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-5 rounded-lg transition Add_to_Cart_btn"
                >
                  Add to Cart
                </button>
              )}

              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-5 rounded-lg transition back_to_products_btn"
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

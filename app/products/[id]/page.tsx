"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { API_BASE_URL } from "@/utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

export default function ProductDetailModal() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Product not found or server error: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-500 mb-4">
            {error || "No product data available."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* Product layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image
              src={product.image}
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
              <span className="font-semibold">Part Number:</span>{" "}
              {product.part_number}
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
                onClick={() => router.back()}
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

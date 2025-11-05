"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://hotbray-backend.onrender.com/products/${id}`);
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
      <p className="text-center mt-10 text-gray-600">Loading product...</p>
    );

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/products" className="text-blue-600 underline">
          Back to Products
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">No product data available.</p>
        <Link href="/products" className="text-blue-600 underline">
          Back to Products
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8 mt-10">
        {/* 🖼 Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 relative h-80">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover rounded-lg"
          />
        </div>

        {/* 🧾 Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
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

          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Add to Cart
            </button>

            <Link
              href="/products"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

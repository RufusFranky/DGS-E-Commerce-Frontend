"use client";
import Image from "next/image";
import Carousel from "./componets/Carousel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  part_number: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Carousel Section */}
      <Carousel />

      {/* Featured Products Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-10 featured-products-heading">
          Featured Products
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-56 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.category}</p>
                <button
                  onClick={() => router.push(`/products`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ShopNow_btn cursor-pointer" 
                >
                  View Products
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

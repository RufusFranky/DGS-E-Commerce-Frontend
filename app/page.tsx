"use client";
import Image from "next/image";
import Carousel from "./componets/Carousel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();
        setProducts(data.slice(0, 4)); // show only top 4 featured products
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
      {/* Hero Section */}
      <section className="bg-white text-center py-15 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Welcome to <span className="logo">HOTBRAY</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing deals and authentic products — all in one place!
        </p>
        <button
          onClick={() => router.push("/products")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ShopNow_btn"
        >
          Shop Now
        </button>
      </section>

      {/* Carousel Section */}
      <Carousel />

      {/* Featured Products Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
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
                <p className="text-gray-600">${product.price}</p>
                <button
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ShopNow_btn"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

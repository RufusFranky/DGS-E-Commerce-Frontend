"use client";
import Image from "next/image";
import Carousel from "./componets/Carousel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/api";
import CategoriesMarquee from "./componets/CategoriesMarquee";
import OurSpecs from "./componets/OurSpec";
import Rating from '@/app/componets/Rating';
import RatingModal from '@/app/componets/RatingModal';
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState<boolean | null>(null);
  const [selectedProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Jaguar" | "Range Rover">("Jaguar");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/products?category=${encodeURIComponent(
            selectedCategory
          )}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Carousel Section */}
      <Carousel />
      <CategoriesMarquee />

      {/* Featured Products Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-3xl font-semibold text-center featured-products-heading">
            Featured Products
          </h2>
          <div className="flex items-center gap-3">
            <label htmlFor="featured-category" className="text-gray-700">
              Category
            </label>
            <select
              id="featured-category"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as "Jaguar" | "Range Rover")
              }
              className="border border-gray-300 rounded-lg px-4 py-2 category-filter-select"
            >
              <option value="Jaguar">Jaguar</option>
              <option value="Range Rover">Range Rover</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-gray-600">
            No products found for {selectedCategory}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
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
           
                <div className="mt-2">
                  <Rating value={4} />
                </div>
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
      <OurSpecs />
      {/* ⭐ Rating Modal Rendering */}
      {ratingModal && selectedProductId && user?.id && (
        <RatingModal
          ratingModal={ratingModal}
          setRatingModal={setRatingModal}
          productId={selectedProductId}
          userId={user.id}
          onReviewSubmitted={() => {
            // optional: refresh logic if needed
            console.log("Review submitted for product:", selectedProductId);
          }}
        />
      )}
    </main>
  );
}

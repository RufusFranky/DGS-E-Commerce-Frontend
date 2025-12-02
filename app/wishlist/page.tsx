"use client";

import { useWishlist } from "@/app/context/wishlistContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { toastCartAdd } from "@/utils/toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();
  const { addToCart } = useCart(); // 🆕 cart import

  // Fetch all products & filter by wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          cache: "no-store",
        });

        const data: Product[] = await res.json();
        const wishlistProducts = data.filter((p) =>
          wishlist.includes(String(p.id))
        );

        setProducts(wishlistProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchProducts();
    }
  }, [wishlist, isSignedIn]);

  // 🚫 Not logged in → show message
  if (!isSignedIn) {
    return (
      <div className="text-center mt-20 text-lg text-gray-700">
        Please log in to view your wishlist.
      </div>
    );
  }

  if (loading)
    return <p className="text-center my-10 text-black">Loading wishlist...</p>;
  if (products.length === 0)
    return (
      <p className="text-center my-10 text-black">Your wishlist is empty.</p>
    );

  // 🆕 Cart Handler
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    toastCartAdd(product.name, 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black py-10 px-6 md:px-16">
      <h1 className="text-2xl font-bold mb-6 ml-20">My Wishlist</h1>

      <div className="space-y-4 wishlsit_div">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            {/* LEFT SIDE - PRODUCT INFO */}
            <div className="flex items-center gap-4">
              {/* Image */}
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
                className="w-20 h-20 object-cover rounded-md"
              />

              {/* Text info */}
              <div>
                {/* Product Name (Clickable) */}
                <a
                  href={`/products/${product.id}`}
                  className="text-lg font-semibold hover:text-blue-600 transition"
                >
                  {product.name}
                </a>

                <p className="text-gray-600 text-sm">
                  {product.category} • {product.part_number}
                </p>

                <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
              </div>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex items-center gap-4">
              {/* 🆕 Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-sm"
              >
                Add to Cart
              </button>

              {/* Remove Wishlist Icon */}
              <button
                onClick={() => removeFromWishlist(String(product.id))}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
                    2 0 01-1.995-1.858L5 7m5
                    4v6m4-6v6m1-10V4a1 1 0
                    00-1-1h-4a1 1 0 00-1 1v3M4
                    7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
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

export default function ProductsPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Apply all filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter (name or part number)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.part_number?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Price sorting
    if (priceSort === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category, priceSort, products]);

  // ✅ Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setPriceSort("");
    setFilteredProducts(products);
  };

  // ✅ Handle Add to Cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      {/* ✅ Banner Section */}
      <section className="relative w-full h-[300px] md:h-[400px] mb-10">
        <Image
          src="/product_banner.png"
          alt="Products Banner"
          fill
          className=" rounded-lg"
        />
      </section>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or part number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          <option value="Jaguar">Jaguar</option>
          <option value="Range Rover">Range Rover</option>
        </select>

        {/* Price Sort */}
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">Sort by</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Clear Filters
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              <div
                className="relative w-full h-56 mb-4 cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
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
              <p className="text-sm text-gray-500">
                Part No: {product.part_number}
              </p>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition ShopNow_btn"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition ShopNow_btn"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

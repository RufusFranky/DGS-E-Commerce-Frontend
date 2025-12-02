"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "@/utils/api";
import ProductDetailModal from "./../componets/ProductDetailModal";
import { toastCartAdd } from "@/utils/toast";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "../context/wishlistContext";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

// 🔥 highlight matched part of suggestion
function highlightMatch(text: string, query: string) {
  const regex = new RegExp(`(${query})`, "i");
  return text.replace(regex, `<strong class='text-blue-600'>$1</strong>`);
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [category, setCategory] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // 🟢 load all products
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

  // 🟢 autosuggest while typing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const url = `${API_BASE_URL.replace(
          "/api",
          ""
        )}/search/suggest?q=${encodeURIComponent(searchTerm)}`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.hits || []);
      } catch (err) {
        console.error("Suggest error:", err);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🟢 Meilisearch search results
  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const url = `${API_BASE_URL.replace(
          "/api",
          ""
        )}/search/products?q=${encodeURIComponent(searchTerm)}`;
        const res = await fetch(url);
        const data = await res.json();
        setSearchResults(data.hits || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearch();
  }, [searchTerm]);

  // 🟢 final reducer
  useEffect(() => {
    let updated = searchResults.length > 0 ? [...searchResults] : [...products];

    if (category) {
      updated = updated.filter((p) => p.category === category);
    }

    if (priceSort === "low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-low") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
  }, [products, searchResults, category, priceSort]);

  // 🔥 click outside closes suggestions
  useEffect(() => {
    const close = () => setSuggestions([]);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setPriceSort("");
    setSearchResults([]);
    setSuggestions([]);
    setFilteredProducts(products);
  };

  const handleAddToCart = (product: Product) => {
    if (!isSignedIn) return;
    addToCart({ ...product, quantity: 1 });
    toastCartAdd(product.name, 1);
  };

  const applySuggestion = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      {/* Banner */}
      <section className="relative w-full h-[300px] md:h-[400px] mb-10">
        <Image
          src="/product_banner.png"
          alt="Products Banner"
          width={1100}
          height={200}
          className="rounded-lg object-cover"
        />
      </section>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 justify-between search-filter-bar">
        {/* Search Box */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or part number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                setActiveIndex((prev) =>
                  Math.min(prev + 1, suggestions.length - 1)
                );
              }
              if (e.key === "ArrowUp") {
                setActiveIndex((prev) => Math.max(prev - 1, 0));
              }
              if (e.key === "Enter" && activeIndex >= 0) {
                applySuggestion(suggestions[activeIndex].name);
              }
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white z-50 w-full border rounded-lg shadow mt-1 max-h-64 overflow-auto text-black">
              {suggestions.map((s, i) => (
                <li
                  key={s.id}
                  onClick={() => applySuggestion(s.name)}
                  className={`px-4 py-2 cursor-pointer ${
                    activeIndex === i ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html:
                      highlightMatch(s.name, searchTerm) +
                      ` <span class='text-gray-500 text-sm'>(${s.part_number})</span>`,
                  }}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Filters */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 category-filter-select"
        >
          <option value="">All Categories</option>
          <option value="Jaguar">Jaguar</option>
          <option value="Range Rover">Range Rover</option>
        </select>

        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 price_sort-select"
        >
          <option value="">Sort by</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Clear Filters
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col relative"
            >
              {/* Heart Icon */}
              <button
                onClick={() =>
                  isInWishlist(String(product.id))
                    ? removeFromWishlist(String(product.id))
                    : addToWishlist(String(product.id))
                }
                className="absolute top-3 right-3 z-10 text-red-500 text-[26px] cursor-pointer"
              >
                {isInWishlist(String(product.id)) ? (
                  <IoMdHeart className="text-red-600" />
                ) : (
                  <IoMdHeartEmpty className="text-gray-600 hover:text-red-600 transition" />
                )}
              </button>

              <div
                className="relative w-full h-56 mb-4 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
              </div>

              <h3 className="text-lg font-medium text-gray-900">
                {product.name}
              </h3>

              {!isSignedIn ? (
                <p className="text-gray-600">Login to view price</p>
              ) : (
                <p className="text-gray-600">${product.price}</p>
              )}

              <p className="text-sm text-gray-500">
                Part No: {product.part_number}
              </p>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>

              <div className="mt-auto flex gap-2">
                {!isSignedIn ? (
                  <button className="flex-1 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                    Login required
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition Add_to_Cart_btn"
                  >
                    Add to Cart
                  </button>
                )}

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 p-1 rounded-lg transition View_Product_btn"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

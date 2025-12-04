// app/components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModel";
import { FaClock, FaTruck } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useWishlist } from "../context/wishlistContext";
import { useUser } from "@clerk/nextjs";
import { IoMdHeartEmpty } from "react-icons/io";

const ClerkSafe = dynamic(() => import("../NavbarClerk"), { ssr: false });

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [showLogin, setShowLogin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();
const wishlistCount = wishlist.length;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 z-50 nav shadow-xl">
      {/* Info Bar */}
      <div className="py-2 Info_Bar">
        <div className="mx-auto flex flex-wrap justify-center md:justify-between items-center px-9 gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2">
              <FaClock className="text-white text-sm" />
              <span>
                Open Hours: <strong className="text-white">24/7</strong>
              </span>
            </div>
          </div>

          <div className="text-center">
            Super Value Deals:
            <a href="./products">
              <strong className="cursor-pointer hover:underline shop_now">
                Shop Now
              </strong>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <FaTruck className="text-white text-sm" />
            <span>Fast and Free Shipping</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white relative">
        {/* Logo */}
        <a href="./">
          <h1 className="font-bold logo">DGSTECH</h1>
        </a>

        {/* Desktop menu */}
        <div className="space-x-6 hidden md:flex">
          <a href="./" className="nav_links">
            Home
          </a>
          <a href="./products" className="nav_links">
            Products
          </a>
          <a href="./contact" className="nav_links">
            Contact
          </a>
          <a href="./admin" className="nav_links">Admin</a>
        </div>

        {/* Right items (cart + clerk) */}
        <div className="flex items-center space-x-6">

          {/* Wishlist */}
          <button
            onClick={() => router.push("/wishlist")}
            className="relative cursor-pointer flex items-center gap-1"
            aria-label="Open wishlist"
          >
            <div className="relative">
              <IoMdHeartEmpty className="heart_icon" />

              {/* ⭐ Show only when logged in */}
              {isSignedIn && wishlistCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-blue-600 text-xs text-white rounded-full px-1.5 wishlist-count"
                  style={{ color: "white" }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>
            {/* <span className="nav_links">Wishlist</span> */}
          </button>

          {/* Cart */}
          <a href="./cart">
            <button
              onClick={() => router.push("/cart")}
              className="relative cursor-pointer"
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cart-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6 0h4"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-xs text-white rounded-full px-1.5 cart-Count">
                  {totalItems}
                </span>
              )}
            </button>
          </a>

          {/* Quick Part Add button */}
          <button
            onClick={() => router.push("/quick-order")}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition fast-order-btn"
          >
            Quick Order
          </button>

          {/* Clerk */}
          {isClient && <ClerkSafe />}

          {/* 🍔 Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden flex flex-col space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span
              className={`block h-0.5 w-6 bg-gray-700 transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-700 transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-700 transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-60 py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <a href="./" className="nav_links text-lg">
              Home
            </a>
            <a href="./products" className="nav_links text-lg">
              Products
            </a>
            <a href="./contact" className="nav_links text-lg">
              Contact
            </a>
            <a href="./admin" className="nav_links">Admin</a>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

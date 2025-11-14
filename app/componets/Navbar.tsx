"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModel";
import { FaClock, FaHeadset, FaPhoneAlt, FaTruck } from "react-icons/fa";
import dynamic from "next/dynamic";

// ⛔ Clerk components must load only on client
const ClerkSafe = dynamic(
  () => import("../NavbarClerk"),
  { ssr: false }
);

export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 z-50 nav">
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

            <div className="flex items-center gap-2">
              <FaHeadset className="text-white text-sm" />
              <span>Live Chat</span>
            </div>

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-white text-sm" />
              <span>Call Support</span>
            </div>
          </div>

          <div className="text-center">
            Super Value Deals:
            <a href="./products">
              <strong className="text-white cursor-pointer hover:underline">
                Shop Now
              </strong>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <FaTruck className="text-white text-sm" />
            <span>Fast and Free Shipping all over UK</span>
          </div>
        </div>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-white z-50">
        <a href="./">
          <h1 className="font-bold logo">DGSTECH</h1>
        </a>

        <div className="space-x-6 hidden md:flex">
          <a href="./" className="nav_links">Home</a>
          <a href="./products" className="nav_links">Products</a>
          <a href="./contact" className="nav_links">Contact</a>
        </div>

        <div className="flex items-center space-x-6">
          {/* Cart */}
          <button onClick={toggleCart} className="relative cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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

          {/* Clerk user button is now safe */}
          {isClient && <ClerkSafe />}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

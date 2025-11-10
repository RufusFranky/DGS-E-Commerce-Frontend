"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModel";
 
export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const [showLogin, setShowLogin] = useState(false);
 
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
 
  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <a href="./">
          <h1 className="text-2xl font-bold logo">DGSTECH</h1>
        </a>
 
        {/* Links */}
        <div className="space-x-6 hidden md:flex">
          <a href="./" className="text-blue-700 hover:text-gray-600 text-1xl">
            Home
          </a>
          <a href="./products" className="text-blue-700 hover:text-gray-600 text-1xl">
            Products
          </a>
          <a href="#" className="text-blue-700 hover:text-gray-600 text-1xl">
            Contact
          </a>
        </div>
 
        {/* Right side buttons */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <button onClick={toggleCart} className="relative">
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
 
          {/* Login button */}
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </nav>
 
      {/* Popup Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
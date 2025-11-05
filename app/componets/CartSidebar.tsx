"use client";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    isCartOpen,
    toggleCart,
  } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={toggleCart}
        className="text-gray-500 hover:text-gray-700 mb-4"
      >
        ✕ Close
      </button>
      <h2 className="text-xl font-semibold mb-4 mt-5 text-black">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                className="rounded"
              />
              <div className="flex-1">
                <h3 className="text-gray-800 font-medium">{item.name}</h3>
                <p className="text-sm text-gray-800">${item.price}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="px-2 decrement-button"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="px-2 increment-button"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

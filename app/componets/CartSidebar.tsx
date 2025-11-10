"use client";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartModal() {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    isCartOpen,
    toggleCart,
  } = useCart();

  if (!isCartOpen) return null; // Hide when closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={toggleCart}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-2 text-center">
          🛒 Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-4 last:border-none"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={70}
                  height={70}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">${item.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900">
              Total: $
              {cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

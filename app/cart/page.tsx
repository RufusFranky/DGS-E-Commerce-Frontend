
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";  // ✅ Added Clerk

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  const router = useRouter();
  const { isSignedIn } = useUser(); // ✅ Check login state

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  // 🔒 If not logged in, block access and show login modal
  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-black">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to access your cart
        </h2>

        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            Login to continue
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-8 text-black">
      <div className="max-w-6xl mx-auto px-4">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl">Cart</h1>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/quotes")}
              className="bg-gray-800 text-white px-3 py-1 rounded cursor-pointer hover:bg-black transition"
            >
              My Quotes
            </button>

            <button
              onClick={() => router.push("/quick-order")}
              className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
            >
              Quick Order
            </button>

            <button
              onClick={() => clearCart()}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm">
              <div className="col-span-4 text-center">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-4 text-center">Qty</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded cart_product"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    ${Number(item.price || 0).toFixed(2)}
                  </div>

                  <div className="col-span-4 text-center">
                    <div className="inline-flex items-center border rounded">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-3 py-1 cursor-pointer"
                      >
                        -
                      </button>
                      <div className="px-3">{item.quantity}</div>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-3 py-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="font-medium cart_remove_btn">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 cursor-pointer ml-5 hover:bg-gray-200 rounded px-2 py-1"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-2xl font-bold">${subtotal.toFixed(2)}</div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => router.push("/products")}
                  className="px-4 py-2 border rounded cursor-pointer"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => router.push("/checkout")}
                  className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

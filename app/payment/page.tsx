"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

type CheckoutData = {
  billing: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
};

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [upiId, setUpiId] = useState("");

  // Load checkout data
  useEffect(() => {
    const savedData = sessionStorage.getItem("checkoutInfo");
    if (savedData) {
      setCheckoutData(JSON.parse(savedData));
    } else {
      router.push("/checkout");
    }
  }, [router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/products");
    }
  }, [cartItems, router]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    // Simple mock validation for UPI
    if (paymentMethod === "UPI" && !upiId.trim()) {
      alert("Please enter your UPI ID before proceeding.");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      clearCart();
      setShowSuccess(false);
      router.push("/products");
    }, 2500);
  };

  if (!checkoutData) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading payment details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-20 text-black">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Payment Gateway
      </h1>

      {/* Payment Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>

        <div className="divide-y divide-gray-200 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 gap-4"
            >
              {/* Product Image */}
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-lg object-cover border border-gray-200"
              />

              {/* Product Info */}
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>

              {/* Product Price */}
              <span className="text-gray-800 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-lg font-semibold text-right mb-6">
          Total: ${totalAmount.toFixed(2)}
        </p>

        {/* Billing & Shipping Info */}
        <div className="border-t pt-4 mb-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
            <p className="text-gray-600 text-sm">
              {checkoutData.billing.fullName}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.billing.address}, {checkoutData.billing.city},{" "}
              {checkoutData.billing.state} - {checkoutData.billing.pincode}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.billing.country}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.billing.email}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.billing.phone}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            <p className="text-gray-600 text-sm">
              {checkoutData.shipping.fullName}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.shipping.address}, {checkoutData.shipping.city},{" "}
              {checkoutData.shipping.state} - {checkoutData.shipping.pincode}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.shipping.country}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.shipping.email}
            </p>
            <p className="text-gray-600 text-sm">
              {checkoutData.shipping.phone}
            </p>
          </div>
        </div>

        {/*  Payment Method Section */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
                className="h-4 w-4 text-blue-600"
              />
              <span>UPI Payment (Google Pay, PhonePe, Paytm)</span>
            </label>

            {paymentMethod === "UPI" && (
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={() => setPaymentMethod("Card")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Credit / Debit Card</span>
            </label>

            {paymentMethod === "Card" && (
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Name on Card"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/*  Buttons Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={() => router.push("/checkout")}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            ← Back to Checkout
          </button>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Place Order
          </button>
        </div>
      </div>

      {/*  Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              ✅ Order Placed Successfully!
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for shopping with DGSTECH.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the products page...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { API_BASE_URL } from "@/utils/api";

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
  const { user } = useUser();

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

  const handlePlaceOrder = async () => {
    if (paymentMethod === "UPI" && !upiId.trim()) {
      alert("Please enter your UPI ID before proceeding.");
      return;
    }

    try {
      const clerk_user_id = user?.id || null;

      const orderPayload = {
        clerk_user_id,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          part_number: item.part_number,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        total_amount: totalAmount,
        payment_method: paymentMethod,
        billing: checkoutData?.billing,
        shipping: checkoutData?.shipping,
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        console.error("Order error:", await res.text());
        alert("Order failed. Please try again.");
        return;
      }

      setShowSuccess(true);

      setTimeout(() => {
        clearCart();
        setShowSuccess(false);
        router.push("/orders");
      }, 2500);
    } catch (error) {
      console.error("Order request failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  if (!checkoutData) {
    return (
      <main className="flex items-center justify-center h-screen text-black">
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
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-500 text-sm">
                  Qty: {item.quantity}
                </p>
              </div>
              <span className="text-gray-800 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-lg font-semibold text-right mb-6">
          Total: ${totalAmount.toFixed(2)}
        </p>

        {/* Billing & Shipping */}
        <div className="border-t pt-4 mb-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
            {Object.values(checkoutData.billing).map((v, i) => (
              <p key={i} className="text-gray-600 text-sm">{v}</p>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            {Object.values(checkoutData.shipping).map((v, i) => (
              <p key={i} className="text-gray-600 text-sm">{v}</p>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              <span>UPI Payment</span>
            </label>

            {paymentMethod === "UPI" && (
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            )}

            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={() => router.push("/checkout")}
            className="border px-8 py-3 rounded-lg"
          >
            ← Back to Checkout
          </button>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              ✅ Order Placed Successfully!
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for shopping with HOTBRAY.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your orders...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

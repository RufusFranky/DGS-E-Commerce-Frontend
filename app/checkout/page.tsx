"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

type AddressInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  const [billing, setBilling] = useState<AddressInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [shipping, setShipping] = useState<AddressInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const total = cartItems.reduce(
    (s, it) => s + Number(it.price) * (it.quantity || 1),
    0
  );

  const handleChange = (
    section: "billing" | "shipping",
    field: keyof AddressInfo,
    value: string
  ) => {
    if (section === "billing")
      setBilling((prev) => ({ ...prev, [field]: value }));
    else setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = (data: AddressInfo) => {
    return Object.entries(data).every(([, value]) => value.trim() !== "");
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before continuing.");
      return;
    }

    if (!validateFields(billing)) {
      alert("Please fill in all required billing fields.");
      return;
    }

    if (!sameAsBilling && !validateFields(shipping)) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      const checkoutData = {
        billing,
        shipping: sameAsBilling ? billing : shipping,
      };

      sessionStorage.setItem("checkoutInfo", JSON.stringify(checkoutData));
      sessionStorage.setItem("checkoutCart", JSON.stringify(cartItems));
      router.push("/payment");
    } catch (err) {
      console.error("Error saving checkout info:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-16 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section */}
          <form
            onSubmit={handleProceed}
            className="md:col-span-2 bg-white rounded-lg shadow p-6"
          >
            {/* Billing Info */}
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(billing).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={value}
                    onChange={(e) =>
                      handleChange(
                        "billing",
                        key as keyof AddressInfo,
                        e.target.value
                      )
                    }
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>

            {/* Same as billing toggle */}
            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                id="sameAsBilling"
                className="w-4 h-4"
              />
              <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
                Shipping same as billing
              </label>
            </div>

            {/* Shipping Info (conditional) */}
            {!sameAsBilling && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(shipping).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={value}
                        onChange={(e) =>
                          handleChange(
                            "shipping",
                            key as keyof AddressInfo,
                            e.target.value
                          )
                        }
                        required
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-medium w-full"
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </form>

          {/* Right Section */}
          <aside className="bg-white rounded-lg p-6 shadow h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="w-16 h-12 relative">
                      <Image
                        src={it.image || "/placeholder.png"}
                        alt={it.name}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {it.quantity || 1}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(Number(it.price) * (it.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Shipping & taxes will be calculated at payment.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

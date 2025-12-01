"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { useCart } from "../../context/CartContext";

interface AddressDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  billing: AddressDetails;
  shipping: AddressDetails;
  created_at: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
//   const { addToCart } = useCart();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL_PROD ||
    "http://localhost:4000";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/details/${id}`);
        const data = await res.json();
        if (data.success) setOrder(data.order);
      } catch (err) {
        console.error("Order details fetch error:", err);
      }
    };
    fetchOrder();
  }, [id, API_BASE]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading order details...
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const estDelivery = new Date(orderDate);
  estDelivery.setDate(orderDate.getDate() + 5);

  // Order Progress Delivery Status
  const today = new Date();
  const daysPassed = Math.floor(
    (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const status =
    daysPassed >= 4 ? "Delivered"
    : daysPassed >= 2 ? "Shipped"
    : "Processing";

  const steps = ["Processing", "Shipped", "Delivered"];

  return (
    <main className="max-w-5xl mx-auto bg-gray-50 py-10 px-6 text-black">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Order #{order.id}
      </h1>

      {/* Billing Details */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Billing Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {order.billing.name}</p>
          <p><strong>Phone:</strong> {order.billing.phone}</p>
          <p><strong>Email:</strong> {order.billing.email}</p>
          <p><strong>Address:</strong> {order.billing.address}</p>
          <p><strong>City:</strong> {order.billing.city}</p>
          <p><strong>State:</strong> {order.billing.state}</p>
          <p><strong>Zipcode:</strong> {order.billing.zipcode}</p>
          <p><strong>Country:</strong> {order.billing.country}</p>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Shipping Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {order.shipping.name}</p>
          <p><strong>Phone:</strong> {order.shipping.phone}</p>
          <p><strong>Email:</strong> {order.shipping.email}</p>
          <p><strong>Address:</strong> {order.shipping.address}</p>
          <p><strong>City:</strong> {order.shipping.city}</p>
          <p><strong>State:</strong> {order.shipping.state}</p>
          <p><strong>Zipcode:</strong> {order.shipping.zipcode}</p>
          <p><strong>Country:</strong> {order.shipping.country}</p>
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Payment Method</h2>
        <p className="text-gray-700 text-sm capitalize">{order.payment_method}</p>
      </section>

      {/* Products */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Products</h2>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-800">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="text-right font-semibold text-lg">
          Total: ${Number(order.total_amount).toFixed(2)}
        </div>

        {/* Reorder Button */}
        {/* <button
          onClick={() => {
            order.items.forEach((item) => {
              addToCart({
                id: Math.floor(Math.random() * 1_000_000),
                part_number: item.name, // change if backend returns part_number
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: "/placeholder.png",
              });
            });
          }}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-lg mt-4"
        >
          Reorder Items
        </button> */}
      </section>

      {/* Estimated Delivery */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-2 text-blue-600">
          Estimated Delivery
        </h2>
        <p className="font-semibold text-gray-900 text-lg">
          {estDelivery.toLocaleDateString()}
        </p>
      </section>

      {/* Order Progress Timeline */}
      <section className="bg-white p-6">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Order Progress</h2>

        <div className="flex justify-between mb-3 text-sm font-medium">
          {steps.map((step) => (
            <span
              key={step}
              className={status === step ? "text-blue-600 font-bold" : "text-gray-400"}
            >
              {step}
            </span>
          ))}
        </div>

        <div className="relative h-2 bg-gray-200">
          <div
            className="absolute h-2 bg-blue-600 rounded-full transition-all duration-700"
            style={{
              width:
                status === "Processing"
                  ? "33%"
                  : status === "Shipped"
                  ? "66%"
                  : "100%",
            }}
          ></div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          Current Status: <span className="font-semibold">{status}</span>
        </p>
      </section>
    </main>
  );
}

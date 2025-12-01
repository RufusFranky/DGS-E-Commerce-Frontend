"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  created_at: string;
}

export default function OrdersPage() {
  const { user, isSignedIn } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL_PROD ||
    "http://localhost:4000";

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${user?.id}`);
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isSignedIn, user?.id, API_BASE]);

  if (!isSignedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-black text-xl">
        Please login to view your orders.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-black text-xl">
        Loading orders...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-20 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No orders found. Start shopping!
        </p>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at);
            const estDelivery = new Date(orderDate);
            estDelivery.setDate(orderDate.getDate() + 5);

            const today = new Date();
            const daysPassed = Math.floor(
              (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            const status =
              daysPassed >= 4 ? "Delivered"
              : daysPassed >= 2 ? "Shipped"
              : "Processing";

            const statusColor =
              status === "Processing"
                ? "bg-yellow-500"
                : status === "Shipped"
                ? "bg-blue-600"
                : "bg-green-600";

            return (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
              >
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>

                  {/* Status Badge */}
                  <span
                    className={`text-white px-3 py-1 rounded-md text-sm font-semibold ${statusColor}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  Ordered on:{" "}
                  <span className="font-medium">
                    {orderDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Estimated Delivery:{" "}
                  <span className="font-medium">
                    {estDelivery.toLocaleDateString()}
                  </span>
                </div>

                {/* CTA button */}
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className=" bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
                >
                  View Order Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

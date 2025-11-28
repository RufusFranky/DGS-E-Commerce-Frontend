"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

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
  created_at: string;
}

export default function OrdersPage() {
  const { user, isSignedIn } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL_PROD ||
    "http://localhost:4000";

  useEffect(() => {
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

    if (!isSignedIn) return;
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
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4 space-y-3">
                {order.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.name} × {it.quantity}
                    </span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="text-right pt-4 font-semibold text-lg">
                Total: $ {Number(order.total_amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

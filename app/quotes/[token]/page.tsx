// app/quotes/[token]/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/api";
import { useCart } from "../../context/CartContext";
import { toastError, toastSuccess } from "@/utils/toast";
import { productImages } from "@/utils/imageMap";

type QuoteItem = {
  id: number | null;
  part_number: string;
  name: string | null;
  price: number | null;
  qty: number;
  mapped_to?: string | null;
};

type Quote = {
  id: number;
  quote_number: string;
  token: string;
  user_id?: string | null;
  user_email?: string | null;
  name?: string | null;
  note?: string | null;
  created_at: string;
};

export default function QuoteViewPage({ params,}: { params: Promise<{ token: string }>;}) {
    
  const router = useRouter();
  const { addToCart } = useCart();

  // Fix ESLint – memoize API base
  const API_BASE = useMemo(() => API_BASE_URL, []);

  const { token } = React.use(params);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchQuote = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/quotes/view/${encodeURIComponent(token)}`
        );
        const json = await res.json();

        if (!res.ok) {
          toastError(json.error || "Quote not found");
          return;
        }

        setQuote(json.quote);
        setItems(json.items || []);
      } catch {
        toastError("Server error loading quote");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [API_BASE, token]);

  const addAllToCart = () => {
    if (items.length === 0) {
      toastError("No items to add");
      return;
    }

    items.forEach((it) => {
      addToCart({
        id: it.id ?? Math.floor(Math.random() * 1_000_000),
        name: it.name || it.part_number,
        price: it.price || 0,
        image: productImages[it.name || it.part_number] || "/no-image.png",
        quantity: it.qty,
      });
    });

    toastSuccess("Quote added to cart");
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-black">
        Quote not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {quote.quote_number}
            </h1>
            <div className="text-sm text-gray-500">
              Created: {new Date(quote.created_at).toLocaleString()}
            </div>
            {quote.user_email && (
              <div className="text-sm text-gray-500">
                For: {quote.user_email}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={addAllToCart}
              className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
            >
              Add All to Cart
            </button>
            <button
              onClick={() => router.push("/quotes")}
              className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded p-4 shadow">
          {items.length === 0 ? (
            <div className="text-sm text-gray-600">No items.</div>
          ) : (
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div>
                    <div className="font-medium">
                      {it.name || it.part_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Part: {it.part_number}
                      {it.mapped_to ? ` • mapped to ${it.mapped_to}` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      ${it.price ?? 0} × {it.qty}
                    </div>
                    <div className="text-sm text-gray-500">
                      Subtotal: ${((it.price ?? 0) * it.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

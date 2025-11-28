// app/quotes/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { API_BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/utils/toast";
import { useCart } from "../context/CartContext";
import { productImages } from "@/utils/imageMap";
import { MdDelete } from "react-icons/md";

type QuoteSummary = {
  id: number;
  quote_number: string;
  token: string;
  name: string | null;
  user_email: string | null;
  created_at: string;
  item_count: number;
};

type ConvertItem = {
  id: number | null;
  part_number: string;
  name: string | null;
  price: number | null;
  qty: number;
  mapped_to?: string | null;
};

export default function MyQuotesPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const { addToCart } = useCart();

  // Memoize API base to fix ESLint warning
  const API_BASE = useMemo(() => API_BASE_URL, []);

  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/quotes/user/${encodeURIComponent(user.id)}`
        );
        const json = await res.json();

        if (!res.ok) {
          toastError(json.error || "Failed to load quotes");
          return;
        }

        setQuotes(json.quotes || []);
      } catch {
        toastError("Server error loading quotes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [API_BASE, isSignedIn, user]);

  const deleteQuote = async (quoteId: number) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const res = await fetch(`${API_BASE}/quotes/${quoteId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        toastError(json.error || "Failed to delete quote");
        return;
      }

      toastSuccess("Quote deleted");

      // Remove deleted quote from list
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    } catch {
      toastError("Server error while deleting quote");
    }
  };

  const viewQuote = (token: string) => {
    router.push(`/quotes/${token}`);
  };

  const convertToCart = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/quotes/convert-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();

      if (!res.ok) {
        toastError(json.error || "Failed to convert quote");
        return;
      }

      const items: ConvertItem[] = json.items || [];

      items.forEach((it) => {
        addToCart({
          id: it.id ?? Math.floor(Math.random() * 1_000_000),
          part_number: it.part_number, // ← added
          name: it.name || it.part_number,
          price: it.price || 0,
          image: productImages[it.name || it.part_number] || "/no-image.png",
          quantity: it.qty,
        });
      });

      toastSuccess("Quote added to cart");
      router.push("/cart");
    } catch {
      toastError("Server error converting quote");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-black">
        Please sign in to view your quotes.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Quotes</h1>

        {loading ? (
          <p>Loading...</p>
        ) : quotes.length === 0 ? (
          <p>No quotes yet. Create one using Fast Order.</p>
        ) : (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {q.quote_number}
                    {q.name ? ` — ${q.name}` : ""}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(q.created_at).toLocaleString()} • {q.item_count}{" "}
                    items
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => viewQuote(q.token)}
                    className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => convertToCart(q.token)}
                    className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="px-3 py-1 text-2xl hover:text-shadow-blue-700 rounded cursor-pointer"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

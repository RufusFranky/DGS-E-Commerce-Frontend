"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save wishlist to localStorage when changed
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}

// app/layout.tsx
import "./globals.css";
import Navbar from "./componets/Navbar";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./componets/CartModel";
import Footer from "./componets/Footer";
import {ClerkProvider} from '@clerk/nextjs'

export const metadata = {
  title: "DGSTECH",
  description: "A simple eCommerce demo with Next.js + Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-gray-50 text-gray-900">
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <main>{children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}

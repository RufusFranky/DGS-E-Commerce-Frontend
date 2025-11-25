// app/layout.tsx
import "./globals.css";
import Navbar from "./componets/Navbar";
import { CartProvider } from "./context/CartContext";
import Footer from "./componets/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

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
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="bg-gray-50 text-gray-900"
      >
        <Providers>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster
              position="bottom-right"
              gutter={12}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1e1e1e",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  marginBottom: "50px",
                },
                success: {
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "white",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "white",
                  },
                },
              }}
            />
          </CartProvider>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

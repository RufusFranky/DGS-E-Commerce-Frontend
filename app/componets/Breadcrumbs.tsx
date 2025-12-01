"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const prettyNames: Record<string, string> = {
  cart: "Cart",
  products: "Products",
  contact: "Contact",
  checkout: "Checkout",
  payment: "Payment",
  "quick-order": "Quick Order",
  quotes: "Quotes",
  orders: "Orders",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      href,
      label: prettyNames[seg] || decodeURIComponent(seg.replace(/-/g, " ")),
    };
  });

  return ( 
    <nav className="text-sm text-gray-600 my-4 bread_links">
      <ul className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/" className="font-medium">
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2 ">
            <span>/</span>
            <Link
              href={crumb.href}
              className={`hover:text-blue-600 capitalize ${
                index === breadcrumbs.length - 1 ? " text-blue-600" : ""
              }`}
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

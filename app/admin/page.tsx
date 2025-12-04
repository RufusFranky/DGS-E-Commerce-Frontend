'use client';
 
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/app/componets/admin/Loading";
import OrdersAreaChart from "@/app/componets/admin/OrdersAreaChart";
 
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
 
const dummyAdminDashboardData = {
  products: 20,
  revenue: 1000,
  orders: 10,
  stores: 25,
  allOrders: []
};
 
export default function AdminDashboard() {
  // --------------------------
  // ALL HOOKS MUST BE AT TOP
  // --------------------------
  const { user, isLoaded } = useUser();
 
  const [loading, setLoading] = useState(true);
  const [dashboardData] = useState(dummyAdminDashboardData); // unused setter removed
 
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
  const allowedAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
 
  useEffect(() => {
    setLoading(false);
  }, []);
 
  // --------------------------
  // NOW WE CAN START LOGIC
  // --------------------------
 
  // still loading user from Clerk
  if (!isLoaded) return <Loading />;
 
  // user not logged in
  if (!user) return <RedirectToSignIn />;
 
  const email = user.primaryEmailAddress?.emailAddress || "";
 
  // user logged in but not admin
  if (email !== allowedAdmin) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        You are not authorized to view this page.
      </div>
    );
  }
 
  // local loading (dashboard animation)
  if (loading) return <Loading />;
 
  // --------------------------
  // DASHBOARD CONTENT
  // --------------------------
 
  const dashboardCardsData = [
    { title: "Total Products", value: dashboardData.products, icon: ShoppingBasketIcon },
    { title: "Total Revenue", value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
    { title: "Total Orders", value: dashboardData.orders, icon: TagsIcon },
    { title: "Total Stores", value: dashboardData.stores, icon: StoreIcon },
  ];
 
  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">
        Admin <span className="text-slate-800 font-medium">Dashboard</span>
      </h1>
 
      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-slate-700">{card.value}</b>
            </div>
            <card.icon size={50} className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
 
      <OrdersAreaChart allOrders={dashboardData.allOrders} />
    </div>
  );
}
 
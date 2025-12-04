import sendIcon from "@/public/sendicon.png";
import clockIcon from "@/public/clockicon.jpg";
import headsetIcon from "@/public/headseticon.png";

export const dummyAdminDashboardData = {
  products: 1,
  revenue: 1000,
  orders: 2,
  stores: 5,
  allOrders: []
};
 
export const couponDummyData = [
  {
    code: "WELCOME10",
    description: "10% OFF for new users",
    discount: 10,
    expiresAt: "2025-12-31",
    forNewUser: true,
    forMember: false,
    isPublic: true
  },
  {
    code: "SAVE20",
    description: "20% Members Discount",
    discount: 20,
    expiresAt: "2025-08-01",
    forNewUser: false,
    forMember: true,
    isPublic: false
  }
];
 

export const ourSpecsData = [
  {
    title: "Free Shipping",
    description: "Enjoy fast and free shipping every time, with reliable delivery right to your door.",
    icon: sendIcon,
    accent: "#0c4395"
  },
  {
    title: "7 Days Easy Return",
    description: "If the part doesn’t fit your vehicle, you can request a return within 7 days for unused items.",
    icon: clockIcon,
    accent: "#0c4395"
  },
  {
    title: "24/7 Customer Support",
    description: "Have doubts? Talk to our friendly experts — we’re here for you!",
    icon: headsetIcon,
    accent: "#0c4395"
  }
];
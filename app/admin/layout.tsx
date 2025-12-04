import { ReactNode } from "react";
import AdminLayout from "@/app/componets/admin/AdminLayout";
 
export const metadata = {
  title: "DGSTECH. - Admin",
  description: "DGSTECH. - Admin",
};
 
interface RootLayoutProps {
  children: ReactNode;   // ← FIX: explicitly typed
}
 
export default function RootAdminLayout({ children }: RootLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
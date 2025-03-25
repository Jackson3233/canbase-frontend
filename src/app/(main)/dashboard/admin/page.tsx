"use client";

import SuperAdminDashboard from "@/components/features/SuperAdminDashboard";
import { useAppSelector } from "@/store/hook";
import { redirect } from "next/navigation";

const AdminDashboardPage = () => {
  const { user } = useAppSelector((state) => state.user);

  // Check for required permissions...
  if (!(
    user?.role === "owner" ||
    user?.functions?.includes("dashboard-club-status") ||
    user?.functions?.includes("dashboard-club-latest") ||
    user?.functions?.includes("dashboard-club-steps")
  )) {
    redirect("/dashboard");
  }

  return <SuperAdminDashboard />;
};

export default AdminDashboardPage;
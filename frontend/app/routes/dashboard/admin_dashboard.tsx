import type { Route } from "../+types/home";
import AdminDashboard from "../../components/dashboard/AdminDashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Page" },
    { name: "description", content: "Dashboard Page" },
  ];
}

export default function AdminDashboardRoute() {
  return (
    <>
      <AdminDashboard />
    </>
  )
}



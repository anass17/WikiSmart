import type { Route } from "./+types/home";
import AdminDashboard from "../components/AdminDashboard";

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



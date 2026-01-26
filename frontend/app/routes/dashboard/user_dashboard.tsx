import type { Route } from "../+types/home";
import UserDashboard from "../../components/dashboard/UserDashboard"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Dashboard Page" },
    { name: "description", content: "User Dashboard Page" },
  ];
}

export default function UserDashboardRoute() {
  return (
    <>
      <UserDashboard />
    </>
  )
}



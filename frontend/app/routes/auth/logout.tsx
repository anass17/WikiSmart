import type { Route } from "../+types/home";
import Logout from "../../components/auth/Logout"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Logout" },
    { name: "description", content: "Logout" },
  ];
}

export default function LoginRoute() {
  return (
    <>
      <Logout />
    </>
  )
}



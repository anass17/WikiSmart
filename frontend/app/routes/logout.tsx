import type { Route } from "./+types/home";
import Logout from "../components/Logout"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Logout Page" },
    { name: "description", content: "Logout Page" },
  ];
}

export default function LoginRoute() {
  return (
    <>
      <Logout />
    </>
  )
}



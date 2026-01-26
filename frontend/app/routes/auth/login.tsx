import type { Route } from "../+types/home";
import LoginForm from "../../components/auth/LoginForm"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login" },
  ];
}

export default function LoginRoute() {
  return (
    <>
      <LoginForm />
    </>
  )
}



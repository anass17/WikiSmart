import type { Route } from "./+types/home";
import LoginForm from "../components/LoginForm"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Login Page" },
  ];
}

export default function LoginRoute() {
  return (
    <>
      <LoginForm />
    </>
  )
}



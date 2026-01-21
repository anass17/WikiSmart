import type { Route } from "./+types/home";
import RegisterForm from "../components/RegisterForm"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Login Page" },
  ];
}

export default function RegisterRoute() {
  return (
    <>
      <RegisterForm />
    </>
  )
}



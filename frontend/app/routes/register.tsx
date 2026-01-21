import type { Route } from "./+types/home";
import RegisterForm from "../components/RegisterForm"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Page" },
    { name: "description", content: "Register Page" },
  ];
}

export default function RegisterRoute() {
  return (
    <>
      <RegisterForm />
    </>
  )
}



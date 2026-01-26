import type { Route } from "../+types/home";
import RegisterForm from "../../components/auth/RegisterForm"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    { name: "description", content: "Register" },
  ];
}

export default function RegisterRoute() {
  return (
    <>
      <RegisterForm />
    </>
  )
}



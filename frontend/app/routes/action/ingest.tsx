import type { Route } from "../+types/home";
import ActionsPage from "../../components/action/ActionsPage"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Actions Page" },
    { name: "description", content: "Actions Page" },
  ];
}

export default function ActionRoute() {
  return (
    <>
      <ActionsPage />
    </>
  )
}



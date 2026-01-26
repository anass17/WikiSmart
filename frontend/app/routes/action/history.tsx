import type { Route } from "../+types/home";
import ActionHistory from "../../components/action/ActionsHistory"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "History Page" },
    { name: "description", content: "History Page" },
  ];
}

export default function HistoryRoute() {
  return (
    <>
      <ActionHistory />
    </>
  )
}



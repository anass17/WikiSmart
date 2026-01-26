import type { Route } from "./+types/home";
import HistoryTimeline from "../components/HistoryTimeline"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "History Page" },
    { name: "description", content: "History Page" },
  ];
}

export default function HistoryRoute() {
  return (
    <>
      <HistoryTimeline />
    </>
  )
}



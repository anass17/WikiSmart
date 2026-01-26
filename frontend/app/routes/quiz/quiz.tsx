import type { Route } from "../+types/home";
import QuizRetry from "../../components/quiz/QuizRetry"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz Page" },
    { name: "description", content: "Retry Quiz" },
  ];
}

export default function QuizRoute() {
  return (
    <>
      <QuizRetry />
    </>
  )
}



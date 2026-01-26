import type { Route } from "../+types/home";
import QuizAttempt from "../../components/quiz/QuizAttempt"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Attempt Page" },
    { name: "description", content: "Quiz Attempt" },
  ];
}

export default function AttemptRoute() {
  return (
    <>
      <QuizAttempt />
    </>
  )
}



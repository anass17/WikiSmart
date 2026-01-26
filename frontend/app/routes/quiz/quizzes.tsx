import type { Route } from "../+types/home";
import QuizzesList from "../../components/quiz/QuizzesList"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quizzes Page" },
    { name: "description", content: "List of Quizzes" },
  ];
}

export default function QuizzesRoute() {
  return (
    <>
      <QuizzesList />
    </>
  )
}



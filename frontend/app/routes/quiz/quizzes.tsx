import type { Route } from "../+types/home";
import MyQuizzes from "../../components/quiz/MyQuizzes"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quizzes Page" },
    { name: "description", content: "List of Quizzes" },
  ];
}

export default function QuizzesRoute() {
  return (
    <>
      <MyQuizzes />
    </>
  )
}



import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import Navbar from "./Navbar"

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

interface QuizItem {
  id: number
  articleTitle: string
  createdAt: string
  questionsCount: string
  bestScore: number
  lastAttemptAt?: string
}



const QuizzesList: React.FC = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])


  const getQuizzes = async () => {

    setLoading(true)
    
    const request = await fetch(`${API_URL}/quiz`, {
      method: 'GET',
      headers: {
         "content-type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("access_token")
      }
    })

    const response = await request.json()

    if (request.status == 200) {
      const list = response.map((item: any) => {
        return {
          id: item.id,
          articleTitle: item.title,
          createdAt: item.submitted_at,
          questionsCount: item.questions_count,
          bestScore: item.best_score,
          lastAttemptAt: item.last_attempt
        }
      })

      setQuizzes(list)
    } else if (request.status == 401) {
      navigate('/login')
    }

    setLoading(false)
  }

  useEffect(() => {
    getQuizzes()
  }, [])

  


  const onRetry = (quizId: number) => {
    alert("Retry")
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="px-10 py-20">
        <h1 className="text-2xl mb-3 text-slate-800 text-center font-bold">Quiz List</h1>
        <p className="text-lg mb-14 text-slate-600 text-center">Here you can find the list of generated quizzes</p>
        <div className="grid grid-cols-2 gap-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="border rounded-lg p-5 bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-blue-900">
                  {quiz.articleTitle}
                </h3>

                <span className="text-sm text-gray-500">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Questions</p>
                  <p className="font-medium text-blue-800">{quiz.questionsCount}</p>
                </div>

                <div>
                  <p className="text-gray-500">Best score</p>
                  <p className="font-medium text-blue-800">
                    {quiz.bestScore}/{quiz.questionsCount}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Last attempt</p>
                  <p className="font-medium text-blue-800">
                    {quiz.lastAttemptAt
                      ? new Date(quiz.lastAttemptAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => onRetry(quiz.id)}
                    className="w-full cursor-pointer bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {
            loading ? (
              <p className="text-center text-gray-500 mt-10">
                loading ...
              </p>
            ) : (
              quizzes.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  No quizzes found.
                </p>
              )
            )
          }

      </div>
    </div>
  )
}

export default QuizzesList
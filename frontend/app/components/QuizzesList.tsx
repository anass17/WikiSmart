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
  const [quizAttempts, setQuizAttempts] = useState<any[]>([])
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)


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

  


  const onShowDetails = async (quizId: number) => {

    setSelectedQuiz(quizzes.filter((item) => item.id == quizId)[0])

    const request = await fetch(`${API_URL}/quiz/${quizId}/attempts`, {
      method: 'GET',
      headers: {
         "content-type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("access_token")
      }
    })

    const response = await request.json()

    if (request.status == 200) {
      setSideMenuOpen(true)
      setQuizAttempts(response.attempts)
    } else if (request.status == 401) {
      navigate('/login')
    }

    setLoading(false)
  }

  const onRetry = () => {
    navigate(`/quiz/${selectedQuiz.id}`)
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
                    onClick={() => onShowDetails(quiz.id)}
                    className="w-full cursor-pointer bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    Show Details
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
      <div className={"h-screen w-screen fixed top-0 right-0 transition-all " + (sideMenuOpen ? "visible" : "invisible")}>
        <div className={"w-full h-full bg-black opacity-25 "} onClick={() => {setSideMenuOpen(false)}}></div>
        <div className={"h-full text-slate-800 max-w-xl w-full overflow-auto transition absolute top-0 right-0 bg-white shadow-lg border-l-3 border-blue-500 " + (sideMenuOpen ? "translate-x-0" : "translate-x-full")}>
            <div className="px-8 py-4 border-b border-gray-300">
              <h2 className="font-semibold">Quiz Details</h2>
            </div>
            <div className="mx-8 py-10 border-b border-gray-300">
              <h3 className="text-xl mb-5 font-semibold text-blue-500">{selectedQuiz?.articleTitle}</h3>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <p><b>Create Date:</b> {new Date(selectedQuiz?.createdAt).toLocaleDateString()}</p>
                <p><b>Qestions:</b> {selectedQuiz?.questionsCount}</p>
                <p><b>Best Score:</b> {selectedQuiz?.bestScore} / {selectedQuiz?.questionsCount}</p>
                <p><b>Last Attempt:</b> {new Date(selectedQuiz?.lastAttemptAt).toLocaleDateString()}</p>
              </div>
              <button
                className="mt-7 cursor-pointer bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={onRetry}
              >
                Try Again
              </button>
            </div>
            <div className="px-8 py-4 mt-5">
              <h4 className="font-semibold">Attempts List</h4>
              <div className="py-8 space-y-4">
                {
                  quizAttempts.map((item) => {

                    let color = ( item.score == 0 ? "red" : ( item.score == selectedQuiz.questionsCount ? "green" : "yellow" ))

                    return (
                      <div className="flex justify-between items-center">
                        <div className="flex justify-center gap-6 items-center">
                          <div className={`w-16 h-16 font-semibold rounded-full border-3 border-${color}-500 bg-${color}-50 flex justify-center items-center`}>
                            {item.score} / {selectedQuiz.questionsCount}
                          </div>
                          <p>{new Date(item.submitted_at).toLocaleString()}</p>
                        </div>
                        <button
                          className="cursor-pointer bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                          onClick={() => {navigate(`/attempt/${item.id}`)}}
                        >
                          View
                        </button>
                      </div>
                    )
                  })
                }
                
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default QuizzesList
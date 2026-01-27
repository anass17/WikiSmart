import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

interface QuizItem {
  id: number
  articleTitle: string
  createdAt: string
  questionsCount: string
  bestScore: number
  lastAttemptAt: string
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
    <>
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
    </>
  )
}

const MyQuizzes = () => {
  

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

  // Helper to determine score color
  const getScoreColor = (score: number, total: number) => {
    if (score == total) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score != 0) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <>
      <div className="p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Quizzes</h1>
              <p className="text-slate-500 mt-2">Track your knowledge and review your previous attempts.</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Passed</span>
              <p className="text-4xl font-black text-blue-600">{quizzes.length}</p>
            </div>
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                {/* Card Top: Article Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold capitalize text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {quiz.articleTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">{quiz.questionsCount} Questions Total</p>

                  {/* Score and Stats */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Best Score</p>
                      <div className={`mt-1 px-3 py-1 rounded-full border font-bold text-sm inline-block ${getScoreColor(quiz.bestScore, +quiz.questionsCount)}`}>
                        {quiz.bestScore || 0} / {quiz.questionsCount}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Last Attempt</p>
                      <p className="text-xs font-semibold text-slate-700 mt-1">{new Date(quiz.lastAttemptAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className="w-full bg-slate-50 cursor-pointer hover:bg-blue-600 hover:text-white py-4 text-sm font-bold text-slate-600 transition-all border-t border-slate-100 flex justify-center items-center gap-2"
                  onClick={() => onShowDetails(quiz.id)}
                >
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ))}

            {/* Empty State / Add New Placeholder */}
            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-all cursor-pointer group"
              onClick={() => {navigate('/ingest')}}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <p className="font-bold text-sm">Generate New Quiz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Side Menu */}

      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${sideMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => {setSideMenuOpen(false)}}
        />

        {/* Side Menu Panel */}
        <aside className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${sideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Quiz Details</h2>
            <button 
              onClick={() => {setSideMenuOpen(false)}} 
              className="p-2 cursor-pointer hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            {/* Main Info Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Article</span>
                <span className="text-xs text-slate-400 font-medium">Created {new Date(selectedQuiz?.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6">{selectedQuiz?.articleTitle}</h3>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Best Score</p>
                  <p className="text-2xl font-black text-blue-700">{selectedQuiz?.bestScore || 0} / {selectedQuiz?.questionsCount}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Questions</p>
                  <p className="text-2xl font-black text-slate-700">{selectedQuiz?.questionsCount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-indigo-50/50 rounded-xl mb-8">
                <span className="text-sm font-medium text-slate-600">Last attempt: <b>{new Date(selectedQuiz?.lastAttemptAt).toDateString()}</b></span>
                <button 
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-200"
                  onClick={onRetry}
                >
                    Try Again
                </button>
              </div>
            </div>

            {/* Previous Attempts Section */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Attempt History</h4>
              <div className="space-y-3">
                {quizAttempts.map((attempt) => (
                  <div key={attempt.id} className="group p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-400">{new Date(attempt.submitted_at).toLocaleString()}</p>
                      <p className="text-lg font-black text-slate-800">
                        {attempt.score} / {selectedQuiz.questionsCount}
                      </p>
                    </div>
                    <button 
                      className="p-2 bg-slate-100 cursor-pointer text-slate-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all"
                      onClick={() => {navigate(`/attempt/${attempt.id}`)}}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </>
    </>
  );
};

export default MyQuizzes;

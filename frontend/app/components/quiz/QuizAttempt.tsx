import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Quiz from "./Quiz";
import Navbar from "../ui/Navbar";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const QuizRetry: React.FC = () => {

    const navigate = useNavigate();
    const {id} = useParams<{id: string}>()
    const [quizAttempt, setQuizAttempt] = useState<any>(null)
    const [quizDetails, setQuizDetails] = useState<any>(null)
    const [quizError, setQuizError] = useState<string>("")
    const [quizLoading, setQuizLoading] = useState<boolean>(true)

    const getQuizAttempt = async () => {
        const request = await fetch(`${API_URL}/quiz/attempt/${id}`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })

        const response = await request.json()

        if (request.status == 200) {
            setQuizAttempt(response.attempt.QuizAttempt)
            setQuizDetails(response.attempt.Quiz)
            setQuizError("")
        } else if (request.status == 401) {
            navigate('/login')
        } else {
            setQuizError(response.detail)
        }

        setQuizLoading(false)
    }

    useEffect(() => {
        getQuizAttempt()
    }, [])

    if (!id) {
        return (
            <div className="text-center py-10">
                Quiz Not Found
            </div>
        )
    }


    return (
        <>
            {
                quizError ? (
                    <div className="text-center py-10 text-red-700">
                        Error! {quizError}
                    </div>
                ) : (
                    quizLoading ? (
                        <div className="text-center py-10">
                            Loading ...
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl mb-10 font-semibold text-center">Quiz Attempt</h1>
                            <div className="mt-4 p-4 bg-white border rounded shadow">
                                <h3 className="font-semibold mb-5">Quiz</h3>
                                {
                                    quizAttempt.score !== null && (
                                        <div className={`h-16 w-16 mx-auto rounded-full border-4 mb-10 
                                            border-${quizAttempt.score == 0 ? "red" : (quizAttempt.score == quizDetails.content.length ? "green" : "yellow")}-500 
                                            flex justify-center items-center`}>
                                            {quizAttempt.score} / {quizDetails.content.length}
                                        </div>
                                    )
                                }

                                {
                                    quizDetails.content.map((item: any, index: number) => {
                                        return (
                                            <div key={'q-' + index}>
                                                <h4 className="font-bold text-sm mb-2">{index + 1}. {item.question}</h4>
                                                <div className="grid grid-cols-4 gap-3 mb-5">
                                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[0] == item.answer) ? "text-green-500 border-green-100 bg-green-50" : (item.options[0] == quizAttempt.user_answers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`}>A. {item.options[0]}</p>
                                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[1] == item.answer) ? "text-green-500 border-green-100 bg-green-50" : (item.options[1] == quizAttempt.user_answers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`}>B. {item.options[1]}</p>
                                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[2] == item.answer) ? "text-green-500 border-green-100 bg-green-50" : (item.options[2] == quizAttempt.user_answers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`}>C. {item.options[2]}</p>
                                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[3] == item.answer) ? "text-green-500 border-green-100 bg-green-50" : (item.options[3] == quizAttempt.user_answers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`}>D. {item.options[3]}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                )
            }
        </>
    );
};









const QuizAttempt = () => {

    
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>()
    const [quizAttempt, setQuizAttempt] = useState<any>(null)
    const [quizDetails, setQuizDetails] = useState<any>(null)
    const [quizError, setQuizError] = useState<string>("")
    const [quizLoading, setQuizLoading] = useState<boolean>(true)

    const getQuizAttempt = async () => {
        const request = await fetch(`${API_URL}/quiz/attempt/${id}`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })

        const response = await request.json()

        if (request.status == 200) {
            setQuizAttempt(response.attempt.QuizAttempt)
            setQuizDetails(response.attempt.Quiz)
            setQuizError("")
        } else if (request.status == 401) {
            navigate('/login')
        } else {
            setQuizError(response.detail)
        }

        setQuizLoading(false)
    }

    useEffect(() => {
        getQuizAttempt()
    }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* --- QUIZ HEADER --- */}
        <header className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 capitalize">Quiz Attempt</h1>
              <p className="text-sm text-slate-500 mt-1">Created on: {new Date(quizDetails?.submitted_at).toDateString()}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</p>
                <p className="text-xl font-bold text-blue-600">{quizDetails?.content.length}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Best Score</p>
                <p className="text-xl font-bold text-emerald-500">{quizAttempt?.score} / {quizDetails?.content.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- QUESTIONS LIST --- */}
        <div className="space-y-6">
          {
            quizDetails?.content.map((item: any, index: number) => (
                <div key={"q" + index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                    </span>
                    <p className="text-lg font-bold text-slate-800 leading-snug">{item.question}</p>
                </div>

                {/* Options as Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.options.map((option: string) => {
                    const isSelected = quizAttempt.user_answers[index] === option;
                    const isCorrect = option === quizDetails?.content[index].answer;
                    
                    let stateClasses = "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400";
                    
                    if (isCorrect) stateClasses = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 ring-2 ring-emerald-200";
                    else if (isSelected && !isCorrect) stateClasses = "bg-red-500 border-red-500 text-white opacity-90";
                    else stateClasses = "bg-slate-50 border-slate-100 text-slate-400 grayscale-[0.5]";

                    return (
                        <button
                        key={option}
                        className={`px-5 py-4 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center ${stateClasses}`}
                        >
                        {option}
                        {isCorrect && (
                            <div className="">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                        )}
                        </button>
                    );
                    })}
                </div>
                </div>
            ))
          }
          {
            quizError && (
                <p className="text-red-500 text-center py-3">{quizError}</p>
            )
          }
        </div>

        {/* --- SUBMIT BUTTON --- */}
        {
            // !submitted ? (
            // <button 
            //     onClick={handleQuizSubmit}
            //     disabled={Object.keys(answers).length < quizDetails?.length}
            //     className={`w-full cursor-pointer mt-10 py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
            //     Object.keys(answers).length < quizDetails?.length 
            //     ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            //     : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1'
            //     }`}
            // >
            //     Submit All Answers
            // </button>
            // ) : (
            // <button 
            //     onClick={retryQuiz}
            //     className="w-full mt-10 py-5 cursor-pointer rounded-2xl font-black text-xl bg-slate-800 text-white hover:bg-black transition-all"
            // >
            //     Try Again
            // </button>
            // )
        }
      </div>
    </div>
  );
};

export default QuizAttempt;
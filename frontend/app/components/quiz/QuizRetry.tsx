import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const QuizRetry = () => {

  const navigate = useNavigate();
    const {id} = useParams<{id: string}>()
    const [quizDetails, setQuizDetails] = useState<any>()
    const [quizError, setQuizError] = useState<string>("")
    const [quizLoading, setQuizLoading] = useState<boolean>(true)
    const [answers, setAnswers] = useState<(string | undefined)[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [quizResult, setQuizResult] = useState<any>()

    const getQuizQuestions = async () => {
        const request = await fetch(`${API_URL}/quiz/${id}`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })

        const response = await request.json()

        if (request.status == 200) {
            setQuizDetails(response.quiz)
            setQuizError("")
        } else if (request.status == 401) {
            navigate('/login')
        } else {
            setQuizError(response.detail)
        }

        setQuizLoading(false)
    }

    useEffect(() => {
        getQuizQuestions()
    }, [])

    if (!id) {
        return (
            <div className="text-center py-10">
                Quiz Not Found
            </div>
        )
    }

  // State

    const handleSelectOption = (id: number, answer: string) => {
        if (submitted) {
            return
        }
        let answers_list = [...answers]
        answers_list[id] = answer

        setAnswers(answers_list)
    }

    const handleQuizSubmit = async () => {
        if (quizDetails?.content.length != answers.length || answers.includes(undefined)) {
            setQuizError("Please answer all questions")
            return 
        }
        
        setQuizError("")
        setQuizLoading(true)

        const request = await fetch(`${API_URL}/action/quiz/score`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                quiz_id: id,
                answers: answers
            })
        })

        const response = await request.json()

        if (request.status == 200) {
            setSubmitted(true)
            setQuizResult({
                answers: response.answers,
                score: response.score,
                total: response.total
            })
        } else {
            setQuizError(response.detail)
        }

        setQuizLoading(false)
    }

    const retryQuiz = () => {
        setQuizResult({answers: []})
        setAnswers([])
        setSubmitted(false)
    }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* --- QUIZ HEADER --- */}
        <header className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 capitalize">{quizDetails?.title}</h1>
              <p className="text-sm text-slate-500 mt-1">Created on: {new Date(quizDetails?.submitted_at).toDateString()}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</p>
                <p className="text-xl font-bold text-blue-600">{quizDetails?.questions_count}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Best Score</p>
                <p className="text-xl font-bold text-emerald-500">{quizDetails?.best_score || 0} / {quizDetails?.questions_count}</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- RESULT BANNER --- */}
        {submitted && (
          <div className={`mb-8 p-6 rounded-2xl border-2 animate-in zoom-in-95 duration-300 ${quizResult.score > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-black ${quizResult.score > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  Quiz Completed!
                </h2>
                <p className="text-slate-600 font-medium">You scored {quizResult.score} / {quizDetails.questions_count} on this attempt.</p>
              </div>
              <div className={`text-4xl font-black ${quizResult.score > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {quizResult.score} / {quizDetails.questions_count}
              </div>
            </div>
          </div>
        )}

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
                    const isSelected = answers[index] === option;
                    const isCorrect = option === quizResult?.answers[index];
                    
                    let stateClasses = "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400";
                    if (isSelected) stateClasses = "bg-blue-600 border-blue-600 text-white";
                    
                    if (submitted) {
                        if (isCorrect) stateClasses = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 ring-2 ring-emerald-200";
                        else if (isSelected && !isCorrect) stateClasses = "bg-red-500 border-red-500 text-white opacity-90";
                        else stateClasses = "bg-slate-50 border-slate-100 text-slate-400 grayscale-[0.5]";
                    }

                    return (
                        <button
                        key={option}
                        onClick={() => handleSelectOption(index, option)}
                        disabled={submitted}
                        className={`px-5 py-4 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center ${stateClasses}`}
                        >
                        {option}
                        {submitted && isCorrect && (
                            <div>
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
            !submitted ? (
            <button 
                onClick={handleQuizSubmit}
                disabled={Object.keys(answers).length < quizDetails?.length}
                className={`w-full cursor-pointer mt-10 py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
                Object.keys(answers).length < quizDetails?.length 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1'
                }`}
            >
                Submit All Answers
            </button>
            ) : (
            <button 
                onClick={retryQuiz}
                className="w-full mt-10 py-5 cursor-pointer rounded-2xl font-black text-xl bg-slate-800 text-white hover:bg-black transition-all"
            >
                Try Again
            </button>
            )
        }
      </div>
    </div>
  );
};

export default QuizRetry;
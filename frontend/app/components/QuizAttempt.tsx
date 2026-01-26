import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Quiz from "./Quiz";
import Navbar from "./Navbar";

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
            <div className="min-h-screen bg-white text-slate-700">
                <Navbar />
                <div className="px-10 py-20">
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
                </div>
            </div>
        </>
    );
};

export default QuizRetry;
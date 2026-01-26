import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Quiz from "./Quiz";
import Navbar from "./Navbar";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const QuizRetry: React.FC = () => {

    const navigate = useNavigate();
    const {id} = useParams<{id: string}>()
    const [quizDetails, setQuizDetails] = useState<any>(null)
    const [quizError, setQuizError] = useState<string>("")
    const [quizLoading, setQuizLoading] = useState<boolean>(true)

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
            console.log(response.quiz)
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


    return (
        <>
            <div className="min-h-screen bg-white text-slate-700">
                <Navbar />
                <div className="px-10 py-20">
                    {
                        quizError ? (
                            <div className="text-center py-10 text-red-700">
                                Error!
                            </div>
                        ) : (
                            quizLoading ? (
                                <div className="text-center py-10">
                                    Loading ...
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl mb-10 font-semibold text-center">Retry a quiz</h1>
                                    <div className="text-sm text-blue-500 mb-10 font-semibold grid grid-cols-3 gap-5 text-center">
                                        <p>{quizDetails?.title}</p>
                                        <p>Created At: {new Date(quizDetails?.submitted_at).toLocaleDateString()}</p>
                                        <p>{quizDetails?.questions_count} Questions</p>
                                    </div>
                                    <Quiz quizId={+id} actionQCM={quizDetails?.content} />
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
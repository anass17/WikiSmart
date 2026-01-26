import React from "react"
import { useState } from "react"

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

interface QuizParams {
    quizId: number,
    actionQCM: any
}


const Quiz : React.FC<QuizParams> = ({quizId, actionQCM} : QuizParams) => {

    const [QCMAnswers, setQCMAnswers] = useState<any[]>([])
    const [submitError, setSubmitError] = useState<string>("")
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
    const [quizResult, setQuizResult] = useState<{answers: string[], score?: number, total?: number}>({answers: []})


    const setQuizAnswer = (id: number, answer: string) => {
        if (quizSubmitted) {
            return
        }
        let answers = [...QCMAnswers]
        answers[id] = answer
        setQCMAnswers(answers)
    }


    const handleQuizSubmit = async () => {
        if (actionQCM.length != QCMAnswers.length || QCMAnswers.includes(undefined)) {
            setSubmitError("Please answer all questions")
            return 
        }
        
        setSubmitError("")
        setSubmitLoading(true)

        const request = await fetch(`${API_URL}/action/quiz/score`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                quiz_id: quizId,
                answers: QCMAnswers
            })
        })

        const response = await request.json()

        if (request.status == 200) {
            setQuizSubmitted(true)
            setQuizResult({
                answers: response.answers,
                score: response.score,
                total: response.total
            })
        } else {
            setSubmitError(response.detail)
        }

        setSubmitLoading(false)
    }

    const retryQuiz = () => {
        setQuizResult({answers: []})
        setQCMAnswers([])
        setQuizSubmitted(false)
    }

    return (
        <div className="mt-4 p-4 bg-white border rounded shadow">
            <h3 className="font-semibold mb-5">Quiz</h3>
            {
                submitError && (
                    <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 text-center">
                        {submitError}
                    </p>
                ) 
            }

            {
                quizResult.score !== null && (
                    <div className={`h-16 w-16 mx-auto rounded-full border-4 mb-10 
                        border-${quizResult.score == 0 ? "red" : (quizResult.score == quizResult.total ? "green" : "yellow")}-500 
                        flex justify-center items-center`}>
                        {quizResult.score} / {quizResult.total}
                    </div>
                )
            }

            {
                quizSubmitted ? (
                    actionQCM.map((item: any, index: number) => {
                        return (
                            <div>
                                <h4 className="font-bold text-sm mb-2" key={'q-' + index}>{index + 1}. {item.question}</h4>
                                <div className="grid grid-cols-4 gap-3 mb-5">
                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[0] == quizResult.answers[index]) ? "text-green-500 border-green-100 bg-green-50" : (item.options[0] == QCMAnswers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`} onClick={() => {setQuizAnswer(index, item.options[0])}}>A. {item.options[0]}</p>
                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[1] == quizResult.answers[index]) ? "text-green-500 border-green-100 bg-green-50" : (item.options[1] == QCMAnswers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`} onClick={() => {setQuizAnswer(index, item.options[1])}}>B. {item.options[1]}</p>
                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[2] == quizResult.answers[index]) ? "text-green-500 border-green-100 bg-green-50" : (item.options[2] == QCMAnswers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`} onClick={() => {setQuizAnswer(index, item.options[2])}}>C. {item.options[2]}</p>
                                    <p className={`p-3 border border-gray-300 rounded ${(item.options[3] == quizResult.answers[index]) ? "text-green-500 border-green-100 bg-green-50" : (item.options[3] == QCMAnswers[index] ? "text-red-500 border-red-100 bg-red-50": "")}`} onClick={() => {setQuizAnswer(index, item.options[3])}}>D. {item.options[3]}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    actionQCM.map((item: any, index: number) => {
                        return (
                            <div>
                                <h4 className="font-bold text-sm mb-2" key={'q-' + index}>{index + 1}. {item.question}</h4>
                                <div className="grid grid-cols-4 gap-3 mb-5">
                                    <p className={`p-3 border border-gray-300 rounded cursor-pointer hover:shadow-md transition-all hover:border-blue-500 hover:text-blue-500 ${item.options[0] == QCMAnswers[index] ? "text-blue-500 border-blue-100 bg-blue-50" : ""}`} onClick={() => {setQuizAnswer(index, item.options[0])}}>A. {item.options[0]}</p>
                                    <p className={`p-3 border border-gray-300 rounded cursor-pointer hover:shadow-md transition-all hover:border-blue-500 hover:text-blue-500 ${item.options[1] == QCMAnswers[index] ? "text-blue-500 border-blue-100 bg-blue-50" : ""}`} onClick={() => {setQuizAnswer(index, item.options[1])}}>B. {item.options[1]}</p>
                                    <p className={`p-3 border border-gray-300 rounded cursor-pointer hover:shadow-md transition-all hover:border-blue-500 hover:text-blue-500 ${item.options[2] == QCMAnswers[index] ? "text-blue-500 border-blue-100 bg-blue-50" : ""}`} onClick={() => {setQuizAnswer(index, item.options[2])}}>C. {item.options[2]}</p>
                                    <p className={`p-3 border border-gray-300 rounded cursor-pointer hover:shadow-md transition-all hover:border-blue-500 hover:text-blue-500 ${item.options[3] == QCMAnswers[index] ? "text-blue-500 border-blue-100 bg-blue-50" : ""}`} onClick={() => {setQuizAnswer(index, item.options[3])}}>D. {item.options[3]}</p>
                                </div>
                            </div>
                        )
                    })
                )
            }
            {
                submitLoading ? (
                    <button className="bg-gray-200 text-slate-700 font-semibold px-4 py-2 rounded-md">Loading ...</button>
                ) : (
                    quizSubmitted ? (
                        <button className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-800" onClick={retryQuiz}>Retry</button>
                    ) : (
                        <button className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-800" onClick={handleQuizSubmit}>Submit</button>
                    )
                )
            }
        </div>
    )
}

export default Quiz
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";

type ActionType = "SUMMERIZE" | "QCM" | "TRANSLATE"

interface TimelineItem {
  id: number
  title: string
  created_at: string
  type: ActionType
  option: string
}

const TYPE_STYLES = {
  SUMMERIZE: {
    label: "Summarize",
    color: "bg-blue-600 text-blue-600 border-blue-600"
  },
  QCM: {
    label: "Quiz",
    color: "bg-purple-600 text-purple-600 border-purple-600"
  },
  TRANSLATE: {
    label: "Translate",
    color: "bg-green-600 text-green-600 border-green-600"
  }
}

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const HistoryTimeline: React.FC = () => {

    const navigate = useNavigate();

    const [actions, setActions] = useState<TimelineItem[]>()
    const [requestError, setRequestError] = useState<string>("")
    const [requestLoading, setRequestLoading] = useState<boolean>(true)

    const getActionsHistory = async () => {
        const request = await fetch(`${API_URL}/action/history`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })

        const response = await request.json()

        if (request.status == 200) {
            setActions(response)
            setRequestError("")
        } else if (request.status == 401) {
            navigate('/login')
        } else {
            setRequestError(response.detail)
        }

        setRequestLoading(false)
    }

    useEffect(() => {
        getActionsHistory()
    }, [])

    return (
        <>
            <div className="min-h-screen bg-white text-slate-700">
                <Navbar />
                <div className="px-10 py-20">
                    {
                        requestError ? (
                            <div className="text-center py-10 text-red-700">
                                Error!
                            </div>
                        ) : (
                            requestLoading ? (
                                <div className="text-center py-10">
                                    Loading ...
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl mb-10 font-semibold text-center">Actions History</h1>
                                    <div className="text-sm text-blue-500 mb-10 font-semibold mx-auto max-w-2xl text-center">
                                        <div className="relative border-l border-gray-300 ml-4 space-y-8">
                                            {actions?.map((item) => {
                                                const type = TYPE_STYLES[item.type]

                                                return (
                                                <div key={item.id} className="relative pl-8">
                                                    {/* Dot */}
                                                    <span
                                                    className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full ${type.color.split(" ")[0]}`}
                                                    />

                                                    {/* Card */}
                                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {item.title}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(item.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-3 text-xs">
                                                            {/* Type badge */}
                                                            <span className={`px-2 py-1 rounded border text-white w-30 ${type.color}`}>
                                                                {type.label}
                                                            </span>

                                                            {/* Option badge */}
                                                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 w-30 border">
                                                                {type.label == "Quiz" ? `${item.option} Questions` : (type.label == "Summerize" ? `Format: ${item.option}` : `To: ${item.option}`)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            })}
                                            </div>
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

export default HistoryTimeline;
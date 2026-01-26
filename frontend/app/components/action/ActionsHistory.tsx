import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";

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
    color: "bg-purple-500"
  },
  QCM: {
    label: "Quiz",
    color: "bg-emerald-500"
  },
  TRANSLATE: {
    label: "Translate",
    color: "bg-blue-500"
  }
}

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

// const ActionsHistory: React.FC = () => {

    // const navigate = useNavigate();

    // const [actions, setActions] = useState<TimelineItem[]>()
    // const [requestError, setRequestError] = useState<string>("")
    // const [requestLoading, setRequestLoading] = useState<boolean>(true)

    // const getActionsHistory = async () => {
    //     const request = await fetch(`${API_URL}/action/history`, {
    //         method: 'GET',
    //         headers: {
    //             "content-type": "application/json",
    //             "Authorization": "Bearer " + localStorage.getItem("access_token")
    //         }
    //     })

    //     const response = await request.json()

    //     if (request.status == 200) {
    //         setActions(response)
    //         setRequestError("")
    //     } else if (request.status == 401) {
    //         navigate('/login')
    //     } else {
    //         setRequestError(response.detail)
    //     }

    //     setRequestLoading(false)
    // }

    // useEffect(() => {
    //     getActionsHistory()
    // }, [])

//     return (
//         <>
//             {
//                 requestError ? (
//                     <div className="text-center py-10 text-red-700">
//                         Error!
//                     </div>
//                 ) : (
//                     requestLoading ? (
//                         <div className="text-center py-10">
//                             Loading ...
//                         </div>
//                     ) : (
//                         <>
//                             <h1 className="text-2xl mb-10 font-semibold text-center">Actions History</h1>
//                             <div className="text-sm text-blue-500 mb-10 font-semibold mx-auto max-w-2xl text-center">
//                                 <div className="relative border-l border-gray-300 ml-4 space-y-8">
//                                     {actions?.map((item) => {
//                                         const type = TYPE_STYLES[item.type]

//                                         return (
//                                         <div key={item.id} className="relative pl-8">
//                                             {/* Dot */}
//                                             <span
//                                             className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full ${type.color.split(" ")[0]}`}
//                                             />

//                                             {/* Card */}
//                                             <div className="bg-white border rounded-lg p-4 shadow-sm">
//                                                 <div className="flex justify-between items-start mb-2">
//                                                     <h3 className="font-semibold text-gray-900">
//                                                         {item.title}
//                                                     </h3>
//                                                     <span className="text-xs text-gray-500">
//                                                         {new Date(item.created_at).toLocaleDateString()}
//                                                     </span>
//                                                 </div>

//                                                 <div className="flex gap-3 text-xs">
//                                                     {/* Type badge */}
//                                                     <span className={`px-2 py-1 rounded border text-white w-30 ${type.color}`}>
//                                                         {type.label}
//                                                     </span>

//                                                     {/* Option badge */}
//                                                     <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 w-30 border">
//                                                         {type.label == "Quiz" ? `${item.option} Questions` : (type.label == "Summerize" ? `Format: ${item.option}` : `To: ${item.option}`)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         )
//                                     })}
//                                     </div>
//                             </div>
//                         </>
//                     )
//                 )
//             }
//         </>
//     );
// };



const ActionsHistory = () => {
  
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


    const TypeIcon = ({ type } : {type: ActionType}) => {
        if (type === "SUMMERIZE") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M4 6h16M4 12h10M4 18h16"/></svg>;
        if (type === "TRANSLATE") return <svg width="16" height="16" fill="white" viewBox="0 0 16 16"><path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/><path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/></svg>;
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
    };


    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="max-w-3xl mx-auto">
            <header className="mb-12">
            <h1 className="text-3xl font-bold text-slate-800">Activity History</h1>
            <p className="text-slate-500 mt-2">A chronological record of your AI-powered insights.</p>
            </header>

            {/* --- TIMELINE CONTAINER --- */}
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12">
            {actions?.map((item) => (
                <div key={item.id} className="relative pl-10">
                
                {/* Timeline Node Icon */}
                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full ${TYPE_STYLES[item.type].color} flex items-center justify-center shadow-lg shadow-slate-200 border-4 border-white z-10`}>
                    <TypeIcon type={item.type} />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(item.created_at).toDateString()}</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-1 capitalize group-hover:text-blue-600 transition-colors">
                        {item.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 bg-slate-50 text-slate-600`}>
                        {item.type}
                        </span>
                    </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-semibold text-slate-500">Option: <span className="text-slate-900">{item.option}</span></span>
                    </div>

                    </div>
                </div>

                </div>
            ))}
            </div>

            {/* Footer info */}
            <div className="mt-16 text-center text-slate-400 text-sm italic">
            End of history reached. Keep exploring!
            </div>
        </div>
        </div>
    );
};


export default ActionsHistory;
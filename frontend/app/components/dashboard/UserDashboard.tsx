import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";


interface FullStatistics {
    stats : {
        actions: number
        articles: number
        quizzes: number
    }

    topArticles : {
        id: number
        title: string
        actionsCount: number
        createdAt: string
    }[]
}



const UserDashboard = () => {

    const navigate = useNavigate();

    const [fullStats, setFullStats] = useState<FullStatistics>()


    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const getStatistics = async () => {
        setLoading(true)

        const request = await fetch(`${API_URL}/statistics`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })

        const response = await request.json()

        if (request.status == 200) {
            setFullStats({
                stats: response.counts,
                topArticles: response.top_articles
            })
        } else if (request.status == 401) {
            navigate('/login')
        } else {
            setError(response.detail)
        }

        setLoading(false)
    }

    useEffect(() => {
        getStatistics()
    }, [])

  return (
    <div className="p-8 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Platform Overview</h2>
          <p className="text-slate-500 text-sm">Global performance and engagement metrics.</p>
        </header>

        {/* --- STATISTICS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                    <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Articles Ingested</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{fullStats?.stats?.articles}</h3>
            </div>


            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Quizzes Taken</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{fullStats?.stats?.quizzes}</h3>
            </div>


            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">AI Actions</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{fullStats?.stats?.actions}</h3>
            </div>

        </div>

        <div className="">
          
            {/* --- TOP ARTICLES (Table-like) --- */}
            <section className="py-6">
                <h2 className="text-lg font-semibold mb-4">Top 3 Articles</h2>
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="text-left px-4 py-3">Title</th>
                        <th className="text-center px-4 py-3">Actions</th>
                        <th className="text-right px-4 py-3">Created</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            fullStats?.topArticles?.length == 0 && (
                                <tr className="border-t border-gray-200">
                                    <td className="px-4 py-10 text-sm text-slate-400 text-center" colSpan={3}>
                                        You have no generate articles
                                    </td>
                                </tr>
                            ) 
                        }
                        {fullStats?.topArticles?.map(article => (
                            <tr key={article.id} className="border-t border-gray-200">
                                <td className="px-4 py-3 font-semibold capitalize text-blue-500">
                                    {article.title}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {article.actionsCount}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-500">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
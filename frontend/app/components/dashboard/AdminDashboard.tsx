import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";


const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";


interface FullStatistics {
    stats : {
        actions: number
        articles: number
        quizzes: number
        users: number
    }

    topArticles : {
        id: number
        title: string
        actionsCount: number
        createdAt: string
    }[]

    topUsers : {
        id: number
        firstName: string
        lastName: string
        regDate: string
        email: string
        actionsCount: number
        quizzesCount: number
    }[]
}



const AdminDashboard = () => {

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
                topArticles: response.top_articles,
                topUsers: response.top_users || []
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{fullStats?.stats?.users}</h3>
            </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- TOP ARTICLES (Table-like) --- */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-700">Top Articles</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {fullStats?.topArticles.map((art, i) => (
                <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                  <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{art.title}</h4>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{new Date(art.createdAt).toDateString()}</span>
                    <span className="font-bold text-blue-500">{art.actionsCount} Actions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- TOP USERS (Detailed List) --- */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-700">Top Performing Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    <th className="px-6 py-4 font-bold">User Information</th>
                    <th className="px-6 py-4 font-bold">Joined</th>
                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                    <th className="px-6 py-4 font-bold text-center">Quizzes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {
                        fullStats?.topUsers?.length == 0 && (
                            <tr className="">
                                <td className="px-6 py-10 text-slate-400 text-sm text-center" colSpan={4}>No Details Found</td>
                            </tr>
                        )
                    }

                    {fullStats?.topUsers.map((user, i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{user.firstName} {user.lastName}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(user.regDate).toDateString()}</td>
                        <td className="px-6 py-4 text-center">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{user.actionsCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{user.quizzesCount}</span>
                        </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
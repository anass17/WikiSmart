import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../ui/Navbar";

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
        email: string
        actionsCount: number
        quizzesCount: number
    }[]
}



const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl p-5 shadow-sm border border-blue-200 bg-blue-50">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-blue-900 mt-1">{value}</p>
  </div>
)


const AdminDashboard: React.FC = () => {
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
    <>
        <h1 className="text-4xl mb-10 font-semibold text-center">Dashboard</h1>
        <div className="space-y-8">
            {/* STATISTICS */}
            <section className="py-6">
                <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Actions" value={fullStats?.stats?.actions || 0} />
                <StatCard label="Articles" value={fullStats?.stats?.articles || 0} />
                <StatCard label="Quizzes" value={fullStats?.stats?.quizzes || 0} />
                <StatCard label="Users" value={fullStats?.stats?.users || 0} />
                </div>
            </section>

            {/* TOP ARTICLES */}
            <section className="py-6">
                <h2 className="text-lg font-semibold mb-4">Top 3 Articles</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="text-left px-4 py-3">Title</th>
                        <th className="text-center px-4 py-3">Actions</th>
                        <th className="text-right px-4 py-3">Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fullStats?.topArticles?.map(article => (
                        <tr key={article.id} className="border-t border-gray-200">
                        <td className="px-4 py-3 font-medium">
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

            {/* TOP USERS */}
            <section className="py-6">
                <h2 className="text-lg font-semibold mb-4">Top 3 Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {
                        fullStats?.topUsers?.length == 0 && (
                            <p className="text-slate-500 text-sm">No registered User yet</p>
                        )
                    }
                    {fullStats?.topUsers.map(user => (
                        <div
                        key={user.id}
                        className="rounded-md py-5 px-10 shadow-sm border border-amber-200 bg-amber-50"
                        >
                            <div className="text-2xl text-center mb-2 text-amber-500">
                                #1
                            </div>

                            <div className="flex justify-between gap-3 border-b border-slate-200 py-5">
                                <h3 className="font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <small>
                                    &lt;{user.email}&gt;
                                </small>
                            </div>

                            <div className="py-4">
                                
                                <div className="mt-3 text-sm text-gray-600 space-y-1 flex justify-between">
                                    <p>
                                        <span className="font-medium text-gray-800">
                                            {user.actionsCount}
                                        </span>{" "}
                                        Actions
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">
                                            {user.quizzesCount}
                                        </span>{" "}
                                        Quizzes
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            </div>
        </>
    );
};

export default AdminDashboard;
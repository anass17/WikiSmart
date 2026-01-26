import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from './Navbar'

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



const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl p-5 shadow-sm border border-blue-200 bg-blue-50">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-blue-900 mt-1">{value}</p>
  </div>
)


const UserDashboard: React.FC = () => {
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
    <div className="min-h-screen bg-white text-slate-700">
        <Navbar />
        <div className="px-10 py-20">
            <h1 className="text-4xl mb-10 font-semibold text-center">Dashboard</h1>
            <div className="space-y-8">
                {/* STATISTICS */}
                <section className="py-6">
                    <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard label="Actions" value={fullStats?.stats?.actions || 0} />
                    <StatCard label="Articles" value={fullStats?.stats?.articles || 0} />
                    <StatCard label="Quizzes" value={fullStats?.stats?.quizzes || 0} />
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
            </div>
        </div>
    </div>
  );
};

export default UserDashboard;
import React, { useState } from "react";
import { useNavigate } from "react-router";


const Navbar = () => {

    const navigate = useNavigate();

    try {
        if (!localStorage.getItem("first_name")) {
            navigate("/login");
            return <></>
        }
    } catch {
        navigate("/login");
        return <></>
    }

    const [userName] = useState(localStorage.getItem("first_name") + ' ' + localStorage.getItem("last_name"));
    const [role] = useState(localStorage.getItem("role"))

    return (
        <>

            <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
                
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                
                    <div className="flex items-center">
                        <a href={role == "USER" ? "/user/dashboard" : "/dashboard"} className="text-2xl tracking-wider select-none">
                            Wiki<span className="text-blue-300">Smart</span>
                        </a>
                    </div>

                    <div className="flex items-center space-x-6 text-sm font-semibold">
                        <a href={role == "USER" ? "/user/dashboard" : "/dashboard"} className="flex items-center gap-2 hover:text-blue-200 transition-colors group">
                            {userName}
                        </a>
                        
                        <div className="h-6 w-[1px] bg-white/20"></div>

                        {
                            role === "USER" ? (
                                <>
                                    <a href="/ingest" className="hover:text-blue-200 transition-colors">Studio</a>
                                    <a href="/quizzes" className="hover:text-blue-200 transition-colors">My Quizzes</a>
                                    <a href="/history" className="hover:text-blue-200 transition-colors">History</a>
                                </>
                            ) : (
                                <>
                                    <a href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</a>
                                    <a href="/dashboard" className="hover:text-blue-200 transition-colors">Users</a>
                                    <a href="/dashboard" className="hover:text-blue-200 transition-colors">Settings</a>
                                </>
                            )
                        }
                        

                        <button 
                            className="bg-white cursor-pointer hover:bg-blue-100 px-4 py-2 font-semibold rounded-md text-xs border text-blue-500 transition-all"
                            onClick={() => {navigate('/logout')}}
                        >
                            Logout
                        </button>
                    </div>
                
                </div>
            </nav>
        </>
    );
};

export default Navbar
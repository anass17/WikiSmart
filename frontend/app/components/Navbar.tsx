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

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
            <div className="text-2xl font-bold font-sans">WikiSmart</div>
            <div className="flex items-center space-x-4">
                <a href="/user/dashboard" className="hover:text-slate-300 transition border-r px-4">
                    {userName}
                </a>
                <a href="/actions" className="hover:text-slate-300 transition">
                    Actions
                </a>
                <a href="/quizzes" className="hover:text-slate-300 transition">
                    Quizzes
                </a>
                <a href="/history" className="hover:text-slate-300 transition">
                    History
                </a>
                <button 
                    className="bg-white cursor-pointer text-blue-900 font-semibold px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => {navigate('/logout')}}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Navbar
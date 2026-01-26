import React from 'react'
import { Outlet } from 'react-router';
import Navbar from '../components/ui/Navbar';


const PageLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Navbar />
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
};


export default PageLayout
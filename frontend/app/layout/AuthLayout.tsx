import React from 'react'
import { Outlet } from 'react-router';


const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-4">
            <Outlet />
        </div>
    );
};


export default AuthLayout
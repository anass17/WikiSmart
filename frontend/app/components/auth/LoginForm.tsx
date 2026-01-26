import React, { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{type: string | null, message: string}>({
    type: null,
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading == true) {
        return
    }

    setLoading(true)

    const request = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
         "content-type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const response = await request.json()

    if (request.status == 200) {

      setStatus({
        type: "success",
        message: "Logged in successfully!"
      })

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("first_name", response.first_name);
      localStorage.setItem("last_name", response.last_name);
      localStorage.setItem("role", response.role);

      setTimeout(() => {
        navigate(response.role == "USER" ? "/user/dashboard" : "/dashboard");
      }, 2000)

    } else if (request.status == 401) {

      setStatus({
        type: "error",
        message: response.detail
      })

    } else {

      setStatus({
        type: "error",
        message: "You have errors in your form"
      })

    }
      
    setLoading(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 font-sans p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="p-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
          </div>

          {
            status.type == "error" && (
              <p className="text-red-500 -mt-5 mb-5 text-center">{status.message}</p>
            )
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  className="w-full p-4 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="user@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <input 
                type="password" 
                required
                className="w-full p-4 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {
              loading ? (
                <button className="w-full bg-gray-100 mt-6 cursor-pointer text-slate-700 font-black py-4 rounded-xl transition-all shadow-xl">
                  Signning ...
                </button>
              ) : (
                status.type && status.type == "success" ? (
                  <button  className="w-full bg-green-100 border border-green-300 mt-6 text-green-700 font-black py-4 rounded-xl transition-all shadow-xl">
                    {status.message}
                  </button>
                ) : (
                  <button type="submit" className="w-full bg-blue-600 mt-6 cursor-pointer hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                    Sign In to Dashboard
                  </button>
                )
              )
            }
            
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <a href="/register" className="font-bold text-blue-600 hover:underline">Create Account</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
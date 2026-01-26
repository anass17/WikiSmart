import React, { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{type: string | null, message: string}>({
    type: null,
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    const request = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
         "content-type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const response = await request.json()

    if (request.status == 201) {

      setStatus({
        type: "success",
        message: "Registered successfully!"
      })

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("first_name", response.first_name);
      localStorage.setItem("last_name", response.last_name);
      localStorage.setItem("role", response.role);

      setTimeout(() => {
        navigate(response.role == "USER" ? "/user/dashboard" : "/dashboard");
      }, 2000)

    } else {

      setStatus({
        type: "error",
        message: response.detail
      })

    }
      
    setLoading(false)

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 font-sans p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

        {/* --- RIGHT SIDE: REGISTER FORM --- */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1">Get access to all AI features and tracking.</p>
          </div>

          {
            status.type == "error" && (
              <p className="text-red-500 -mt-5 mb-5 text-center">{status.message}</p>
            )
          }

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="New"
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="User"
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-3.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="user@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="Must be 8+ characters"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {
              loading ? (
                <button className="w-full bg-gray-100 cursor-pointer text-slate-700 font-black py-4 rounded-xl transition-all shadow-xl">
                  Registering ...
                </button>
              ) : (
                status.type && status.type == "success" ? (
                  <button  className="w-full bg-green-100 border border-green-300 text-green-700 font-black py-4 rounded-xl transition-all shadow-xl">
                    {status.message}
                  </button>
                ) : (
                  <button type="submit" className="w-full cursor-pointer bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] mt-2">
                    Create My Account
                  </button>
                )
              )
            }
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <a href="/login" className="font-bold text-blue-600 hover:underline">Sign In</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
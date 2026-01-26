import React, { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const LoginForm: React.FC = () => {
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
        message: "Logged in successfully! ..."
      })

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("first_name", response.first_name);
      localStorage.setItem("last_name", response.last_name);
      localStorage.setItem("role", response.role);

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000)

    } else if (request.status == 401) {

        setStatus({
        type: "error",
        message: response.detail
      })

      setLoading(false)

    } else {

      setStatus({
        type: "error",
        message: "You have errors in your form"
      })

      setLoading(false)

    }

    // .then(response => response.json())
    // .then(data => {
    //   setLoading(false)
    //   console.log(data)
    //   if data
    // })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-5">
            Sign In
        </h1>
        <p className="text-center text-gray-600 mb-10">
            Log in to your account and continue your journey
        </p>

        {
          status.type == "success" && (
            <p className="w-full bg-green-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-green-500 mb-5 -mt-5 text-center">
              {status.message}
            </p>
          )
        }

        {
          status.type == "error" && (
            <p className="w-full bg-red-200 text-slate-700 font-semibold px-8 py-5 rounded-md border-red-500 mb-5 -mt-5 text-center">
              {status.message}
            </p>
          )
        }

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full border border-gray-300 text-slate-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="strong password"
            className="w-full border border-gray-300 text-slate-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        {
          loading ? (
            <button
              type="submit"
              className="w-full bg-gray-200 text-slate-700 font-semibold py-2 rounded-md"
            >
              Loading ...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Login
            </button>
          )
        }
        
      </form>
    </div>
  );
};

export default LoginForm;
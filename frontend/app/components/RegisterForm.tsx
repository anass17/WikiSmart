import React, { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

const RegisterForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        message: "Registered successfully! ..."
      })

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("first_name", response.first_name);
      localStorage.setItem("last_name", response.last_name);

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000)

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
          Join WikiSmart
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Summarize, translate, and generate QCM from your articles with AI
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

        <div className="grid grid-cols-2 gap-5">
          {/* First Name */}
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-semibold mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="firstName"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ahmed"
              className="w-full border border-gray-300 text-slate-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-semibold mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="lastName"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Karim"
              className="w-full border border-gray-300 text-slate-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

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
              Register
            </button>
          )
        }
        
      </form>
    </div>
  );
};

export default RegisterForm;
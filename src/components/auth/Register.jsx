import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ onSwitch }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const success = await register(email, password);
      if (!success) {
        setErr("Registration failed");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-8 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[95vh]">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 select-none">
            Form Builder
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-indigo-700 dark:text-indigo-400 select-none">
            Sign Up
          </h2>
        </div>

        {err && (
          <p
            className="text-center text-red-600 dark:text-red-500 font-semibold"
            role="alert"
          >
            {err}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="registration form"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="email input"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="password input"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300"
          />

          <button
            type="submit"
            aria-label="register button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 select-none">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-300"
          >
            <Link to="/login" tabIndex={-1}>
              Login
            </Link>
          </button>
        </p>
      </div>
    </div>
  );
}

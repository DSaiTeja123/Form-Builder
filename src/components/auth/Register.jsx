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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-12 select-none text-center">
        Form Builder
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-10 sm:p-12 border border-gray-200 dark:border-gray-700 transition-all duration-500"
        aria-label="registration form"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8 text-center select-none">
          Sign Up
        </h2>
        {err && (
          <p
            className="mb-6 text-center text-red-600 dark:text-red-500 font-semibold"
            role="alert"
          >
            {err}
          </p>
        )}
        <input
          className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-label="email input"
        />
        <input
          className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          aria-label="password input"
        />
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-all duration-500"
          type="submit"
          aria-label="register button"
        >
          Register
        </button>
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm select-none">
          Already have an account?{" "}
          <button
            type="button"
            className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-500"
            onClick={onSwitch}
          >
            <Link to="/login" tabIndex={-1}>
              Login
            </Link>
          </button>
        </p>
      </form>
    </div>
  );
}

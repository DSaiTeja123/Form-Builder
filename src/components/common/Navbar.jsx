import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  // Accessible handler for logo "click"
  const onLogoKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("/");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-900 shadow transition-all duration-500">
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate("/")}
        onKeyDown={onLogoKeyDown}
        className="font-bold text-4xl text-indigo-700 dark:text-indigo-300 cursor-pointer transition-all duration-500 select-none"
        aria-label="Go to homepage"
        title="Go to homepage"
      >
        FormBuilder
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          title="Toggle dark/light mode"
          aria-label="Toggle dark or light theme"
          className="text-xl cursor-pointer"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/views")}
              className="text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
            >
              Views
            </button>
            <button
              onClick={() => navigate("/my-forms")}
              className="text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
            >
              My Forms
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

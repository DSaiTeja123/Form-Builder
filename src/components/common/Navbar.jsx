import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Accessible handler for logo "click"
  const onLogoKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("/");
    }
  };

  // Accessible handler for hamburger toggle keydown
  const onMenuKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate("/")}
            onKeyDown={onLogoKeyDown}
            className="font-bold text-3xl sm:text-4xl text-indigo-700 dark:text-indigo-300 cursor-pointer select-none transition-all duration-500"
            aria-label="Go to homepage"
            title="Go to homepage"
          >
            FormBuilder
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              title="Toggle dark/light mode"
              aria-label="Toggle dark or light theme"
              className="text-2xl cursor-pointer"
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onKeyDown={onMenuKeyDown}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="text-indigo-600 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {/* Hamburger icon */}
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          <button
            onClick={toggleTheme}
            title="Toggle dark/light mode"
            aria-label="Toggle dark or light theme"
            className="text-2xl cursor-pointer"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/views");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Views
              </button>
              <button
                onClick={() => {
                  navigate("/my-forms");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                My Forms
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

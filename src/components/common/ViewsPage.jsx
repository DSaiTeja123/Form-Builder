import React from "react";
import Preview from "../builder/Preview";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function ViewsPage({ device, setDevice, steps }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen">
      {/* Navbar full width and sticky */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
        <Navbar />
      </header>

      {/* Back button top-left, fixed below navbar */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back to previous page"
        className="fixed top-16 left-4 z-50 rounded-md border border-indigo-600 px-4 py-2 text-indigo-700 font-semibold bg-white dark:bg-gray-900 hover:bg-indigo-600 hover:text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 shadow-md"
      >
        ← Back
      </button>

      {/* Content below navbar and back button with padding */}
      <main className="pt-20 sm:pt-24 px-6 sm:px-12 flex flex-col items-center justify-start max-w-screen-xl mx-auto">
        <nav
          className="mb-8 flex space-x-6 justify-center w-full"
          role="tablist"
          aria-label="Select device view"
        >
          {["desktop", "tablet", "mobile"].map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={device === d}
              aria-controls={`preview-${d}`}
              tabIndex={device === d ? 0 : -1}
              className={`
                px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300
                focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400
                ${
                  device === d
                    ? "bg-indigo-700 text-white shadow-lg shadow-indigo-400/50 scale-105"
                    : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-300 dark:hover:bg-indigo-700 hover:text-indigo-900 dark:hover:text-indigo-100"
                }
                `}
              onClick={() => setDevice(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </nav>

        {/* Enlarged Preview area with min height */}
        <div
          id={`preview-${device}`}
          className="w-full rounded-xl shadow-2xl ring-1 ring-indigo-300 dark:ring-indigo-600 overflow-hidden min-h-[600px]"
        >
          <Preview steps={steps} device={device} />
        </div>
      </main>
    </div>
  );
}

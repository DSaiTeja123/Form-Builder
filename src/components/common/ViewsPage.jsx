import React, { useState, useEffect } from "react";
import Preview from "../builder/Preview";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * ViewsPage displays a preview of the form in different device modes.
 * Props:
 * - device: (optional) current device view ("desktop", "tablet", "mobile")
 * - setDevice: (optional) function to set device view
 * - steps: (optional) form steps to preview
 */
export default function ViewsPage({
  device: deviceProp,
  setDevice: setDeviceProp,
  steps: stepsProp,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Local device state if not provided by parent
  const [device, setDevice] = useState(deviceProp || "desktop");

  // Local steps state if not provided by parent
  const [steps, setSteps] = useState(stepsProp || []);

  // If steps not provided, try to load from location.state or localStorage
  useEffect(() => {
    if (!stepsProp) {
      if (location.state && location.state.steps) {
        setSteps(location.state.steps);
      } else {
        // Optionally, load a default or last-edited form from localStorage
        const lastForm = localStorage.getItem("last_preview_form");
        if (lastForm) {
          try {
            setSteps(JSON.parse(lastForm));
          } catch {
            setSteps([]);
          }
        }
      }
    }
  }, [location.state, stepsProp]);

  // Sync device state with parent if provided
  useEffect(() => {
    if (deviceProp && setDeviceProp) {
      setDevice(deviceProp);
    }
  }, [deviceProp, setDeviceProp]);

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen">
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
        <Navbar />
      </header>

      <button
        onClick={() => navigate(-1)}
        aria-label="Go back to previous page"
        className="fixed top-16 left-4 z-50 rounded-md border border-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold text-white bg-indigo-300 dark:bg-gray-900 hover:bg-indigo-600 hover:text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 shadow-md"
      >
        ← Back
      </button>

      <main className="pt-20 sm:pt-24 px-4 sm:px-12 flex flex-col items-center justify-start max-w-screen-xl mx-auto">
        <nav
          className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-4 sm:gap-6 w-full"
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
                px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg transition-transform duration-300
                focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400
                ${
                  device === d
                    ? "bg-indigo-700 text-white shadow-lg shadow-indigo-400/50 scale-105"
                    : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-300 dark:hover:bg-indigo-700 hover:text-indigo-900 dark:hover:text-indigo-100"
                }
              `}
              onClick={() => {
                setDevice(d);
                if (setDeviceProp) setDeviceProp(d);
              }}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </nav>

        <div
          id={`preview-${device}`}
          className="w-full rounded-xl shadow-2xl ring-1 ring-indigo-300 dark:ring-indigo-600 overflow-hidden min-h-[400px] sm:min-h-[600px]"
        >
          <Preview steps={steps} device={device} />
        </div>
      </main>
    </div>
  );
}

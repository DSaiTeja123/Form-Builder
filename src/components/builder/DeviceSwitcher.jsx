import React from "react";
import { useTheme } from "../../context/ThemeContext";

const DEVICES = [
  { key: "desktop", label: "Desktop" },
  { key: "tablet", label: "Tablet" },
  { key: "mobile", label: "Mobile" },
];

export default function DeviceSwitcher({ device, onSwitch }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500">
      {DEVICES.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSwitch(key)}
          aria-pressed={device === key}
          aria-label={`Switch to ${label} view`}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
            ${
              device === key
                ? "bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-400"
                : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

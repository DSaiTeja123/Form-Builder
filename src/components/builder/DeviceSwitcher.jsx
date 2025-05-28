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
    <div className="flex gap-4 justify-center items-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500">
      {DEVICES.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-500 ease-in-out
            ${
              device === key
                ? "bg-indigo-600 text-white shadow-md scale-110 ring-2 ring-indigo-400"
                : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
            }`}
          onClick={() => onSwitch(key)}
          aria-pressed={device === key}
          aria-label={`Switch to ${label} view`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

import React from "react";

export default function Input({
  label,
  type = "text",
  className = "",
  error,
  ...props
}) {
  return (
    <div className="mb-4 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-2.5 rounded-2xl text-sm
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          dark:focus:ring-indigo-400 dark:focus:border-indigo-400
          transition-all duration-500
          ${
            error
              ? "border-red-500 focus:ring-red-500 dark:focus:ring-red-400"
              : ""
          }
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${props.id}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

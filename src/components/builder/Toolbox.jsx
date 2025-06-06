import React, { useState } from "react";

const BASIC_FIELDS = [
  { type: "text", label: "Text Input" },
  { type: "textarea", label: "Textarea" },
  { type: "dropdown", label: "Dropdown" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date Picker" },
  { type: "radio", label: "Radio Buttons" },
];

const ADVANCED_FIELDS = [
  { type: "file", label: "File Upload" },
  { type: "slider", label: "Slider" },
  { type: "color", label: "Color Picker" },
  { type: "switch", label: "Switch" },
  { type: "time", label: "Time Picker" },
  { type: "section", label: "Section Header" },
  { type: "repeater", label: "Repeater" },
];

export default function Toolbox({ onDragStart }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 transition-all duration-500 border border-gray-200 dark:border-gray-700 max-w-full sm:max-w-xs">
      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-4 select-none">
        Fields
      </h3>

      <div className="flex flex-col gap-2">
        {BASIC_FIELDS.map((field) => (
          <div
            key={field.type}
            draggable
            onDragStart={(e) => onDragStart(e, field)}
            className="cursor-grab px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-800 text-gray-700 dark:text-gray-200 transition-all duration-300 select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onDragStart(e, field);
            }}
          >
            {field.label}
          </div>
        ))}
      </div>

      <button
        className="mt-6 w-full px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-all duration-300 cursor-pointer select-none"
        onClick={() => setShowAdvanced((a) => !a)}
        type="button"
      >
        {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-2 mt-6">
          {ADVANCED_FIELDS.map((field) => (
            <div
              key={field.type}
              draggable
              onDragStart={(e) => onDragStart(e, field)}
              className="cursor-grab px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-800 text-gray-700 dark:text-gray-200 transition-all duration-300 select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onDragStart(e, field);
              }}
            >
              {field.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

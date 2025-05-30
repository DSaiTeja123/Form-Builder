import React from "react";

export default function FieldConfigPanel({ field, onChange }) {
  if (!field) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 min-h-[200px] flex items-center justify-center text-center transition-all duration-500">
        <span className="text-gray-400 dark:text-gray-500 text-sm select-none">
          Select a field to configure
        </span>
      </div>
    );
  }

  const { config, type } = field;
  const patternType = config.patternType || "";
  const pattern = config.pattern || "";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-500">
      <h4 className="font-bold text-lg sm:text-xl mb-5 text-indigo-700 dark:text-indigo-300 select-none text-center sm:text-left">
        Field Settings
      </h4>

      <div className="flex flex-col gap-4">
        {/* Label */}
        <input
          className="input w-full"
          name="label"
          value={config.label || ""}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          placeholder="Label"
        />

        {/* Placeholder */}
        {(type === "text" || type === "textarea") && (
          <input
            className="input w-full"
            name="placeholder"
            value={config.placeholder || ""}
            onChange={(e) =>
              onChange({ ...config, placeholder: e.target.value })
            }
            placeholder="Placeholder"
          />
        )}

        {/* Options */}
        {(type === "dropdown" || type === "radio") && (
          <input
            className="input w-full"
            name="options"
            value={config.options ? config.options.join(", ") : ""}
            onChange={(e) =>
              onChange({
                ...config,
                options: e.target.value
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Options (comma separated)"
          />
        )}

        {/* Required checkbox */}
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={!!config.required}
            onChange={(e) =>
              onChange({ ...config, required: e.target.checked })
            }
            className="form-checkbox text-indigo-600 dark:text-indigo-500 rounded transition-all duration-500"
          />
          Required
        </label>

        {/* Min/Max Length */}
        {(type === "text" || type === "textarea") && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="input w-full sm:w-1/2"
              type="number"
              min={0}
              value={config.minLength || ""}
              onChange={(e) =>
                onChange({
                  ...config,
                  minLength: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="Min Length"
            />
            <input
              className="input w-full sm:w-1/2"
              type="number"
              min={0}
              value={config.maxLength || ""}
              onChange={(e) =>
                onChange({
                  ...config,
                  maxLength: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="Max Length"
            />
          </div>
        )}

        {/* Pattern Selection */}
        {(type === "text" || type === "textarea") && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Pattern
            </label>
            <select
              className="input mb-2 w-full"
              value={patternType}
              onChange={(e) =>
                onChange({
                  ...config,
                  patternType: e.target.value,
                  pattern: e.target.value === "" ? "" : config.pattern,
                })
              }
            >
              <option value="">None</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>

            <input
              className="input w-full"
              type="text"
              value={pattern}
              onChange={(e) =>
                onChange({
                  ...config,
                  pattern: e.target.value,
                  patternType: "",
                })
              }
              placeholder="Custom Regex Pattern"
              disabled={patternType === "email" || patternType === "phone"}
            />
            <p className="text-xs text-gray-500 mt-1">
              {patternType === "email" &&
                "Standard email format will be enforced."}
              {patternType === "phone" &&
                "Allows 10–15 digit phone numbers (with optional +)."}
              {!patternType && pattern && "Custom regex pattern will be used."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function StepManager({
  steps,
  setSteps,
  activeStep,
  setActiveStep,
}) {
  const addStep = () =>
    setSteps([...steps, { stepName: `Step ${steps.length + 1}`, fields: [] }]);

  const removeStep = (idx) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== idx));
    if (activeStep >= steps.length - 1) setActiveStep(steps.length - 2);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-3 items-center justify-start">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-500 border cursor-pointer
            ${
              activeStep === idx
                ? "bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200"
                : "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            }
            max-w-full sm:max-w-xs
          `}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setActiveStep(idx);
          }}
          onClick={() => setActiveStep(idx)}
        >
          <span className="font-medium truncate max-w-[120px] sm:max-w-full">
            {step.stepName}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveStep(idx);
            }}
            className="text-xs text-indigo-600 hover:underline dark:text-indigo-300 cursor-pointer"
            type="button"
          >
            Edit
          </button>

          {steps.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeStep(idx);
              }}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
              type="button"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addStep}
        className="flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-500 shadow cursor-pointer"
        type="button"
      >
        + Add Step
      </button>
    </div>
  );
}

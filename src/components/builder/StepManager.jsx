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
    <div className="flex flex-wrap gap-3 mb-3 items-center">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-500 border cursor-pointer
            ${
              activeStep === idx
                ? "bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200"
                : "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            }`}
        >
          <span className="font-medium">{step.stepName}</span>

          <button
            onClick={() => setActiveStep(idx)}
            className="text-xs text-indigo-600 hover:underline dark:text-indigo-300"
          >
            Edit
          </button>

          {steps.length > 1 && (
            <button
              onClick={() => removeStep(idx)}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addStep}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-500 shadow"
      >
        + Add Step
      </button>
    </div>
  );
}

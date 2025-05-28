import React from "react";

export default function Stepper({ steps, activeStep }) {
  const totalSteps = steps.length;
  const percent =
    totalSteps > 1 ? ((activeStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 mb-8">
      <div
        className="relative flex justify-between items-center"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={activeStep}
        aria-label="Form progress"
      >
        
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 transition-all duration-500 z-10"
          style={{ width: `${percent}%`, maxWidth: "100%" }}
        ></div>
        
        {steps.map(({ step, label }) => (
          <div
            key={step}
            className="relative z-20 flex flex-col items-center flex-1"
          >
            <div
              tabIndex={0}
              aria-current={activeStep === step ? "step" : undefined}
              title={label}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-default transition-all duration-500
                ${
                  activeStep > step
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : activeStep === step
                    ? "bg-white border-indigo-500 text-indigo-700 dark:bg-gray-900"
                    : "bg-white border-slate-300 text-slate-400 dark:bg-gray-900"
                }`}
            >
              {activeStep > step ? (
                <span className="font-bold">&#10003;</span>
              ) : (
                <span className="font-bold">{step}</span>
              )}
            </div>
            <span className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400 w-20">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

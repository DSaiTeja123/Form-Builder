import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Stepper from "../common/Stepper";
import { toast } from "react-toastify";

// Patterns for common types
const PATTERNS = {
  email: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address",
  },
  phone: {
    value: /^\+?[0-9]{10,15}$/,
    message: "Invalid phone number",
  },
};

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "700px",
  mobile: "375px",
};

export default function Preview({ steps, device, onSubmit: onFinalSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({ mode: "onChange" });

  const nextStep = async () => {
    const valid = await trigger(
      steps[currentStep].fields.map(
        (_, idx) => `step${currentStep}_field${idx}`
      )
    );
    if (valid) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const submitStep = (data) => {
    if (currentStep === steps.length - 1) {
      if (onFinalSubmit) onFinalSubmit(getValues());
      else
        toast.success(
          "Form submitted!\n" + JSON.stringify(getValues(), null, 2)
        );
    } else {
      nextStep();
    }
  };

  return (
    <div className="mt-6">
      <div
        className="mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-500"
        style={{ width: DEVICE_WIDTHS[device] }}
      >
        <Stepper
          steps={steps.map((step, idx) => ({
            step: idx + 1,
            label: step.stepName || `Step ${idx + 1}`,
          }))}
          activeStep={currentStep + 1}
        />

        <form
          onSubmit={handleSubmit(submitStep)}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Step Indicators */}
          <div className="flex flex-wrap gap-2 mb-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-500
                  ${
                    idx === currentStep
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  }`}
              >
                {step.stepName || `Step ${idx + 1}`}
              </div>
            ))}
          </div>

          {/* Dynamic Fields */}
          {steps[currentStep].fields.map((field, idx) => {
            const name = `step${currentStep}_field${idx}`;
            const { type, config } = field;

            let validation = {};
            if (config.required) validation.required = "This field is required";
            if (config.minLength) {
              validation.minLength = {
                value: config.minLength,
                message: `Minimum ${config.minLength} characters`,
              };
            }
            if (config.maxLength) {
              validation.maxLength = {
                value: config.maxLength,
                message: `Maximum ${config.maxLength} characters`,
              };
            }
            if (config.patternType && PATTERNS[config.patternType]) {
              validation.pattern = PATTERNS[config.patternType];
            } else if (config.pattern) {
              validation.pattern = {
                value: new RegExp(config.pattern),
                message: "Invalid format",
              };
            }

            const errorText = errors[name] && (
              <span className="text-red-500 text-xs mt-1">
                {errors[name].message}
              </span>
            );

            switch (type) {
              case "text":
              case "date":
                return (
                  <div key={idx}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {config.label}
                    </label>
                    <input
                      type={type}
                      className="input"
                      placeholder={config.placeholder}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                    />
                    {errorText}
                  </div>
                );

              case "textarea":
                return (
                  <div key={idx}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {config.label}
                    </label>
                    <textarea
                      className="input"
                      placeholder={config.placeholder}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                    />
                    {errorText}
                  </div>
                );

              case "dropdown":
                return (
                  <div key={idx}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {config.label}
                    </label>
                    <select
                      className="input"
                      defaultValue=""
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {config.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errorText}
                  </div>
                );

              case "checkbox":
                return (
                  <label
                    key={idx}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <input type="checkbox" {...register(name, validation)} />
                    {config.label}
                  </label>
                );

              case "radio":
                return (
                  <div key={idx}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {config.label}
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {config.options.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <input
                            type="radio"
                            value={opt}
                            {...register(name, validation)}
                            onBlur={() => trigger(name)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {errorText}
                  </div>
                );

              default:
                return null;
            }
          })}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button type="submit" className="btn-primary">
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

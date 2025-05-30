import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function loadForm(id) {
  try {
    return JSON.parse(localStorage.getItem(`form_${id}`));
  } catch {
    return null;
  }
}

function saveResponse(formId, response) {
  const key = `responses_${formId}`;
  const responses = JSON.parse(localStorage.getItem(key) || "[]");
  responses.push(response);
  localStorage.setItem(key, JSON.stringify(responses));
}

function Stepper({ steps, activeStep }) {
  return (
    <div className="w-full flex items-center mb-8 overflow-x-auto no-scrollbar">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col items-center relative min-w-[50px] sm:min-w-[70px] transition-all duration-500"
        >
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-500
              ${
                idx < activeStep
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : idx === activeStep
                  ? "bg-white dark:bg-gray-800 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                  : "bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
              }`}
          >
            {idx < activeStep ? "✓" : idx + 1}
          </div>
          <span className="mt-2 text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400 w-20 truncate">
            {step.stepName}
          </span>
          {idx < steps.length - 1 && (
            <div className="absolute top-4 right-0 w-full border-t-2 border-slate-300 dark:border-slate-700 z-[-1]"></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PublicForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const form = loadForm(formId);

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (localStorage.getItem(`form_submitted_${formId}`)) {
      setAlreadySubmitted(true);
    }
    if (localStorage.getItem(`form_closed_${formId}`)) {
      setIsClosed(true);
    }
  }, [formId]);

  useEffect(() => {
    localStorage.setItem(`form_data_${formId}`, JSON.stringify(formData));
  }, [formData, formId]);

  useEffect(() => {
    const savedData = localStorage.getItem(`form_data_${formId}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [formId]);

  if (!form)
    return (
      <div className="text-center mt-10 text-red-500">Form not found.</div>
    );

  if (isClosed)
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-950 transition-all duration-500 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
            Form Closed
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This form is no longer accepting responses.
          </p>
        </div>
      </div>
    );

  if (alreadySubmitted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-950 transition-all duration-500 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You have already responded to this form.
            <br />
            You do not have access to submit again or perform any other actions.
          </p>
        </div>
      </div>
    );

  const steps = form.steps;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveResponse(formId, formData);
    localStorage.setItem(`form_submitted_${formId}`, "1");
    toast.success("Thank you for your response!");
    setAlreadySubmitted(true);
    localStorage.removeItem(`form_data_${formId}`);
  };

  const stepFields = steps[currentStep].fields;
  const isStepValid = stepFields.every((field, idx) => {
    const name = `step${currentStep}_field${idx}`;
    if (field.config.required) {
      if (field.type === "checkbox") return !!formData[name];
      return formData[name] && formData[name].toString().trim() !== "";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-950 flex flex-col items-center justify-center transition-all duration-500 p-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-lg shadow p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300 text-center">
          {form.title || "Form"}
        </h2>
        <Stepper steps={steps} activeStep={currentStep} />
        <form
          onSubmit={
            currentStep === steps.length - 1 ? handleSubmit : handleNext
          }
          aria-label="Public form submission"
          className="space-y-6"
        >
          {currentStep === 0 && (
            <>
              <label
                htmlFor="responderEmail"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
              >
                Your Email (optional):
              </label>
              <input
                className="input w-full"
                type="email"
                id="responderEmail"
                name="responderEmail"
                value={formData.responderEmail || ""}
                onChange={handleChange}
                placeholder="Enter your email"
                aria-describedby="emailHelp"
              />
              <small
                id="emailHelp"
                className="block text-sm text-slate-500 dark:text-slate-400"
              >
                We'll never share your email.
              </small>
            </>
          )}
          <div>
            <div className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
              {steps[currentStep].stepName}
            </div>
            {stepFields.map((field, fidx) => {
              const name = `step${currentStep}_field${fidx}`;
              const { type, config } = field;
              switch (type) {
                case "text":
                case "date":
                  return (
                    <div key={fidx} className="mb-4">
                      <label
                        htmlFor={name}
                        className="block mb-1 text-gray-700 dark:text-gray-200"
                      >
                        {config.label}
                      </label>
                      <input
                        className="input w-full"
                        id={name}
                        name={name}
                        type={type}
                        placeholder={config.placeholder}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        required={config.required}
                        aria-required={config.required}
                      />
                    </div>
                  );
                case "textarea":
                  return (
                    <div key={fidx} className="mb-4">
                      <label
                        htmlFor={name}
                        className="block mb-1 text-gray-700 dark:text-gray-200"
                      >
                        {config.label}
                      </label>
                      <textarea
                        className="input w-full"
                        id={name}
                        name={name}
                        placeholder={config.placeholder}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        required={config.required}
                        aria-required={config.required}
                      />
                    </div>
                  );
                case "dropdown":
                  return (
                    <div key={fidx} className="mb-4">
                      <label
                        htmlFor={name}
                        className="block mb-1 text-gray-700 dark:text-gray-200"
                      >
                        {config.label}
                      </label>
                      <select
                        className="input w-full"
                        id={name}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        required={config.required}
                        aria-required={config.required}
                      >
                        <option value="">Select...</option>
                        {config.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                case "checkbox":
                  return (
                    <label
                      key={fidx}
                      className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-200"
                      htmlFor={name}
                    >
                      <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={!!formData[name]}
                        onChange={handleChange}
                        aria-checked={!!formData[name]}
                      />
                      {config.label}
                    </label>
                  );
                case "radio":
                  return (
                    <div
                      key={fidx}
                      className="mb-4"
                      role="radiogroup"
                      aria-labelledby={`${name}-label`}
                    >
                      <div
                        id={`${name}-label`}
                        className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
                      >
                        {config.label}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {config.options.map((opt, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-1 text-gray-700 dark:text-gray-200"
                          >
                            <input
                              type="radio"
                              name={name}
                              value={opt}
                              checked={formData[name] === opt}
                              onChange={handleChange}
                              required={config.required}
                              aria-checked={formData[name] === opt}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary w-full sm:w-auto"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!isStepValid}
              className={`btn-primary w-full sm:w-auto ${
                !isStepValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600 dark:hover:bg-indigo-400"
              } transition-colors duration-300`}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

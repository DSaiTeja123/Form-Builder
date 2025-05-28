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
    <div className="w-full flex items-center mb-8">
      {steps.map((step, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center relative transition-all duration-500">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-500
              ${
                idx < activeStep
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : idx === activeStep
                  ? "bg-white border-indigo-500 text-indigo-700 dark:bg-gray-900"
                  : "bg-white border-slate-300 text-slate-400 dark:bg-gray-900"
              }`}
          >
            {idx < activeStep ? "✓" : idx + 1}
          </div>
          <span className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400 w-20">
            {step.stepName}
          </span>
          {/* Connector line between steps */}
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

  // Persist formData on change (optional)
  useEffect(() => {
    localStorage.setItem(`form_data_${formId}`, JSON.stringify(formData));
  }, [formData, formId]);

  // Load persisted formData on mount
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
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-950 transition-all duration-500">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
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
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-950 transition-all duration-500">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
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
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
          {form.title || "Form"}
        </h2>
        <Stepper steps={steps} activeStep={currentStep} />
        <form
          onSubmit={
            currentStep === steps.length - 1 ? handleSubmit : handleNext
          }
          aria-label="Public form submission"
        >
          {currentStep === 0 && (
            <>
              <label
                htmlFor="responderEmail"
                className="block mb-2 font-medium"
              >
                Your Email (optional):
              </label>
              <input
                className="input mb-4"
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
                className="block mb-4 text-sm text-slate-500 dark:text-slate-400"
              >
                We'll never share your email.
              </small>
            </>
          )}
          <div className="mb-6">
            <div className="font-semibold mb-2">
              {steps[currentStep].stepName}
            </div>
            {stepFields.map((field, fidx) => {
              const name = `step${currentStep}_field${fidx}`;
              const { type, config } = field;
              switch (type) {
                case "text":
                  return (
                    <div key={fidx} className="mb-2">
                      <label htmlFor={name} className="block mb-1">
                        {config.label}
                      </label>
                      <input
                        className="input"
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
                case "textarea":
                  return (
                    <div key={fidx} className="mb-2">
                      <label htmlFor={name} className="block mb-1">
                        {config.label}
                      </label>
                      <textarea
                        className="input"
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
                    <div key={fidx} className="mb-2">
                      <label htmlFor={name} className="block mb-1">
                        {config.label}
                      </label>
                      <select
                        className="input"
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
                      className="flex items-center gap-2 mb-2"
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
                case "date":
                  return (
                    <div key={fidx} className="mb-2">
                      <label htmlFor={name} className="block mb-1">
                        {config.label}
                      </label>
                      <input
                        className="input"
                        type="date"
                        id={name}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        required={config.required}
                        aria-required={config.required}
                      />
                    </div>
                  );
                case "radio":
                  return (
                    <div
                      key={fidx}
                      className="mb-2"
                      role="radiogroup"
                      aria-labelledby={`${name}-label`}
                    >
                      <div
                        id={`${name}-label`}
                        className="block mb-1 font-medium"
                      >
                        {config.label}
                      </div>
                      {config.options.map((opt, i) => (
                        <label key={i} className="mr-4">
                          <input
                            type="radio"
                            name={name}
                            value={opt}
                            checked={formData[name] === opt}
                            onChange={handleChange}
                            required={config.required}
                            aria-checked={formData[name] === opt}
                          />
                          <span className="ml-1">{opt}</span>
                        </label>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          <div className="flex justify-between transition-all duration-500">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`btn px-6 py-2 rounded ${
                currentStep === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Prev
            </button>
            <button
              type="submit"
              disabled={!isStepValid}
              className={`btn px-6 py-2 rounded ${
                isStepValid
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

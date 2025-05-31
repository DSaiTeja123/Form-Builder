import React, { useState, useMemo, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Stepper from "../common/Stepper";
import { toast } from "react-toastify";

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
    setValue,
    control,
  } = useForm({ mode: "onChange" });

  // Find all repeater fields and prepare their names
  const repeaterFields = useMemo(() => {
    const fields = [];
    steps.forEach((step, stepIdx) => {
      step.fields.forEach((field, fieldIdx) => {
        if (field.type === "repeater") {
          fields.push({
            name: `step${stepIdx}_field${fieldIdx}`,
            stepIdx,
            fieldIdx,
          });
        }
      });
    });
    return fields;
  }, [steps]);

  // Create useFieldArray instances for all repeaters at the top level
  const repeaterArrays = {};
  repeaterFields.forEach((field) => {
    repeaterArrays[field.name] = useFieldArray({
      control,
      name: field.name,
    });
  });


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

  const inputClass =
    "w-full px-4 py-2 mt-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-500 max-w-full"
        style={{ maxWidth: DEVICE_WIDTHS[device] }}
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
          {/* Step labels */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-500 whitespace-nowrap ${
                  idx === currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {step.stepName || `Step ${idx + 1}`}
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {steps[currentStep].fields.map((field, idx) => {
              const name = `step${currentStep}_field${idx}`;
              const { type, config } = field;

              let validation = {};
              if (config.required)
                validation.required = "This field is required";
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
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <input
                        type={type}
                        className={inputClass}
                        placeholder={config.placeholder}
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                      />
                      {errorText}
                    </div>
                  );

                case "textarea":
                  return (
                    <div
                      key={idx}
                      className="flex flex-col col-span-1 sm:col-span-2"
                    >
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <textarea
                        className={inputClass}
                        placeholder={config.placeholder}
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        rows={4}
                      />
                      {errorText}
                    </div>
                  );

                case "dropdown":
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <select
                        className={inputClass}
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
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 col-span-1 sm:col-span-2"
                    >
                      <input type="checkbox" {...register(name, validation)} />
                      {config.label}
                    </label>
                  );

                case "radio":
                  return (
                    <div
                      key={idx}
                      className="flex flex-col col-span-1 sm:col-span-2"
                    >
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

                case "file":
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <input
                        type="file"
                        className={inputClass}
                        accept={config.accept}
                        {...register(name, validation)}
                      />
                      {errorText}
                    </div>
                  );

                case "slider":
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          className="w-full"
                          {...register(name, validation)}
                          defaultValue={config.min}
                          onInput={(e) => {
                            e.target.form &&
                              e.target.form.dispatchEvent(
                                new Event("input", { bubbles: true })
                              );
                          }}
                        />
                        <span className="font-mono text-sm min-w-[2rem] text-center">
                          {getValues(name) ?? config.min}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {config.min} - {config.max}
                      </div>
                      {errorText}
                    </div>
                  );

                case "rating":
                  const ratingMax = config.max || 5;
                  const ratingValue = Number(getValues(name)) || 0;
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <div className="flex items-center gap-1">
                        {[...Array(ratingMax)].map((_, i) => (
                          <label key={i} className="cursor-pointer">
                            <input
                              type="radio"
                              value={i + 1}
                              {...register(name, validation)}
                              className="hidden"
                            />
                            <span
                              className={
                                ratingValue >= i + 1
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                              style={{ fontSize: "1.5rem" }}
                            >
                              ★
                            </span>
                          </label>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {ratingValue > 0 ? ratingValue : ""}
                        </span>
                      </div>
                      {errorText}
                    </div>
                  );

                case "color":
                  return (
                    <div key={idx} className="flex flex-col items-start">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <input
                        type="color"
                        className="w-12 h-8 p-0 border-none rounded"
                        {...register(name, validation)}
                      />
                    </div>
                  );

                case "switch":
                  return (
                    <div
                      key={idx}
                      className="flex items-center mb-2 col-span-1 sm:col-span-2"
                    >
                      <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <input type="checkbox" {...register(name, validation)} />
                    </div>
                  );

                case "time":
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <input
                        type="time"
                        className={inputClass}
                        {...register(name, validation)}
                      />
                    </div>
                  );

                case "section":
                  return (
                    <div key={idx} className="col-span-1 sm:col-span-2">
                      <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-200">
                        {config.text || config.label}
                      </h4>
                    </div>
                  );

                case "repeater":
                  // Use the pre-created field array instead of creating it here
                  const repeaterArray = repeaterArrays[name];
                  return (
                    <div key={idx} className="col-span-1 sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      {repeaterArray.fields.map((item, repIdx) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap gap-2 items-center mb-2"
                        >
                          <input
                            className={`${inputClass} flex-grow min-w-[150px]`}
                            {...register(`${name}.${repIdx}.value`, validation)}
                            placeholder={`Item ${repIdx + 1}`}
                          />
                          <button
                            type="button"
                            className="text-red-500 text-xs whitespace-nowrap"
                            onClick={() => repeaterArray.remove(repIdx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-secondary text-xs px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        onClick={() => repeaterArray.append({ value: "" })}
                      >
                        Add Item
                      </button>
                      {errorText}
                    </div>
                  );

                case "signature":
                  // Use a ref for each signature field
                  if (!signatureRefs.current[name]) {
                    signatureRefs.current[name] = React.createRef();
                  }
                  return (
                    <div
                      key={idx}
                      className="flex flex-col col-span-1 sm:col-span-2"
                    >
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <div className="border border-gray-300 bg-white dark:bg-gray-800 rounded">
                        <SignaturePad
                          ref={signatureRefs.current[name]}
                          penColor="black"
                          backgroundColor="rgba(255,255,255,0)"
                          canvasProps={{
                            width: 350,
                            height: 120,
                            className: "rounded bg-white dark:bg-gray-800",
                          }}
                          onEnd={() => {
                            const dataURL = signatureRefs.current[name]?.current
                              ?.getTrimmedCanvas()
                              .toDataURL("image/png");
                            setValue(name, dataURL, { shouldValidate: true });
                          }}
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn-secondary text-xs"
                          onClick={() => {
                            signatureRefs.current[name]?.current?.clear();
                            setValue(name, "", { shouldValidate: true });
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      {errorText}
                    </div>
                  );

                case "matrix":
                  return (
                    <div key={idx} className="col-span-1 sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <table className="border">
                        <thead>
                          <tr>
                            <th></th>
                            {config.columns?.map((col, cidx) => (
                              <th key={cidx} className="border px-2">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {config.rows?.map((row, ridx) => (
                            <tr key={ridx}>
                              <td className="border px-2">{row}</td>
                              {config.columns?.map((col, cidx) => (
                                <td key={cidx} className="border px-2">
                                  <input type="radio" disabled />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );

                case "richtext":
                  return (
                    <div key={idx} className="col-span-1 sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {config.label}
                      </label>
                      <div
                        className="border p-2 min-h-[60px] rounded bg-white dark:bg-gray-800"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const value = e.currentTarget.innerHTML;
                          setValue(name, value, { shouldValidate: true });
                        }}
                        placeholder="Type here..."
                        style={{ outline: "none" }}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Rich text editing (basic)
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium disabled:opacity-50 transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium transition hover:bg-indigo-700"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

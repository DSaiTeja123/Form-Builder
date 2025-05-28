import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Toolbox from "./Toolbox";
import FormCanvas from "./FormCanvas";
import FieldConfigPanel from "./FieldConfigPanel";
import StepManager from "./StepManager";
import ViewsPage from "../common/ViewsPage";
import * as XLSX from "xlsx";
import { useNavigate, useLocation } from "react-router-dom";
import { shortenUrl } from "../../utils/shortenUrl";
import { toast } from "react-toastify";

function getDefaultConfig(type) {
  switch (type) {
    case "text":
      return {
        label: "Text",
        placeholder: "",
        required: false,
        description: "",
      };
    case "textarea":
      return {
        label: "Textarea",
        placeholder: "",
        required: false,
        description: "",
      };
    case "dropdown":
      return {
        label: "Dropdown",
        options: ["Option 1", "Option 2"],
        required: false,
        description: "",
      };
    case "checkbox":
      return { label: "Checkbox", required: false, description: "" };
    case "date":
      return { label: "Date", required: false, description: "" };
    case "radio":
      return {
        label: "Radio",
        options: ["Option 1", "Option 2"],
        required: false,
        description: "",
      };
    default:
      return {};
  }
}

function saveForm(id, data) {
  localStorage.setItem(`form_${id}`, JSON.stringify(data));
}
function getResponses(formId) {
  return JSON.parse(localStorage.getItem(`responses_${formId}`) || "[]");
}
function exportToExcel(responses, formName = "responses") {
  const worksheet = XLSX.utils.json_to_sheet(responses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
  XLSX.writeFile(workbook, `${formName}.xlsx`);
}

export default function FormBuilder() {
  const { user } = useAuth();
  const [steps, setSteps] = useState([{ stepName: "Step 1", fields: [] }]);
  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [formId, setFormId] = useState(
    localStorage.getItem("lastFormId") || ""
  );
  const [shareLink, setShareLink] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [shortening, setShortening] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [device, setDevice] = useState("desktop");
  const [canvasScale, setCanvasScale] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDragStart = (e, field) => {
    e.dataTransfer.setData("field", JSON.stringify(field));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const field = JSON.parse(e.dataTransfer.getData("field"));
    const newField = {
      id: Date.now(),
      type: field.type,
      config: getDefaultConfig(field.type),
    };
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === activeStep
          ? { ...step, fields: [...step.fields, newField] }
          : step
      )
    );
    setSelected(steps[activeStep].fields.length);
  };

  const handleDragOver = (e) => e.preventDefault();

  const updateField = (idx, newConfig) => {
    setSteps((prev) =>
      prev.map((step, sidx) =>
        sidx === activeStep
          ? {
              ...step,
              fields: step.fields.map((f, i) =>
                i === idx ? { ...f, config: newConfig } : f
              ),
            }
          : step
      )
    );
  };

  const deleteField = (idx) => {
    setSteps((prev) =>
      prev.map((step, sidx) =>
        sidx === activeStep
          ? {
              ...step,
              fields: step.fields.filter((_, i) => i !== idx),
            }
          : step
      )
    );
    setSelected(null);
  };

  const handleSaveForm = async () => {
    if (!formTitle.trim()) return toast.error("Form title is required.");
    if (!steps.some((step) => step.fields.length)) {
      return toast.error("Add at least one field before publishing.");
    }

    const id = formId || Math.random().toString(36).slice(2, 10);
    saveForm(id, { title: formTitle, steps, creator: user.email });
    setFormId(id);
    localStorage.setItem("lastFormId", id);

    const longLink = `${window.location.origin}/form/${id}`;
    setShareLink(longLink);
    setShortLink("");
    setShortening(true);

    try {
      const short = await shortenUrl(longLink);
      setShortLink(short);
    } catch (err) {
      setShortLink("");
      toast.error("Could not shorten the link. Showing original link.");
    }
    setShortening(false);
    toast.success("Form published! Share this link: " + longLink);
  };

  const handleExportExcel = () => {
    if (!formId) return toast.error("Publish your form first!");
    const responses = getResponses(formId);
    if (!responses.length) return toast.info("No responses yet.");
    exportToExcel(responses, `responses_${formId}`);
  };

  const deviceButtons = [
    { type: "desktop", label: "Desktop" },
    { type: "tablet", label: "Tablet" },
    { type: "mobile", label: "Mobile" },
  ];

  const minScale = 0.5,
    maxScale = 1.5,
    step = 0.1;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (location.pathname === "/views") {
    return <ViewsPage device={device} setDevice={setDevice} steps={steps} />;
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-all duration-500">
      <Navbar />
      <div className="mx-auto py-8 px-9">
        <div className="flex items-center justify-between mb-4">
          <input
            className="w-1/2 px-3 py-2 text-2xl font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-500"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Form Title"
          />
          <div className="flex items-center gap-2">
            {deviceButtons.map((btn) => (
              <button
                key={btn.type}
                className={`px-3 py-1 rounded font-semibold transition-all duration-500 text-sm ${
                  device === btn.type
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                }`}
                onClick={() => setDevice(btn.type)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <StepManager
          steps={steps}
          setSteps={setSteps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />

        <div className="grid grid-cols-12 gap-4">
          {/* Toolbox */}
          <div className="col-span-2">
            <Toolbox onDragStart={handleDragStart} />
          </div>

          {/* Canvas */}
          <div className="col-span-8 flex flex-col items-center transition-all duration-500">
            <div className="flex justify-center mb-2 gap-2">
              <button
                className="btn-secondary"
                onClick={() =>
                  setCanvasScale((s) => Math.max(minScale, s - step))
                }
                disabled={canvasScale <= minScale}
              >
                -
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Zoom: {(canvasScale * 100).toFixed(0)}%
              </span>
              <button
                className="btn-secondary"
                onClick={() =>
                  setCanvasScale((s) => Math.min(maxScale, s + step))
                }
                disabled={canvasScale >= maxScale}
              >
                +
              </button>
            </div>
            <div
              className="transition-transform duration-300"
              style={{
                width:
                  device === "desktop" ? 700 : device === "tablet" ? 500 : 375,
                transform: `scale(${canvasScale})`,
                transformOrigin: "top center",
              }}
            >
              <FormCanvas
                steps={steps}
                setSteps={setSteps}
                activeStep={activeStep}
                onSelect={setSelected}
                selectedIdx={selected}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDelete={deleteField}
              />
            </div>
          </div>

          {/* Config Panel */}
          <div className="col-span-2">
            <FieldConfigPanel
              field={steps[activeStep].fields[selected]}
              onChange={(cfg) => updateField(selected, cfg)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-5 items-center">
          <button className="btn-primary" onClick={handleSaveForm}>
            Publish & Get Link
          </button>
          <button className="btn-secondary" onClick={handleExportExcel}>
            Download Responses (Excel)
          </button>
          {shortening && (
            <span className="text-gray-500">Shortening link...</span>
          )}
          {shortLink && (
            <a
              href={shortLink}
              className="text-indigo-600 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortLink}
            </a>
          )}
          {!shortLink && shareLink && (
            <a
              href={shareLink}
              className="text-indigo-600 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shareLink}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

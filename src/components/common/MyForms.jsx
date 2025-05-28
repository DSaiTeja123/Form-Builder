import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Moon, Sun } from "lucide-react";

// Helpers
function getAllForms(userEmail) {
  const forms = [];
  for (const key in localStorage) {
    if (key.startsWith("form_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (!data.creator || data.creator === userEmail) {
          forms.push({ id: key.replace("form_", ""), ...data });
        }
      } catch {}
    }
  }
  return forms;
}

function getResponses(formId) {
  return JSON.parse(localStorage.getItem(`responses_${formId}`) || "[]");
}

function exportToExcel(responses, formName = "responses") {
  if (!responses.length) {
    toast.info("No responses yet for this form.");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(responses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
  XLSX.writeFile(workbook, `${formName}.xlsx`);
}

function deleteForm(formId) {
  localStorage.removeItem(`form_${formId}`);
  localStorage.removeItem(`responses_${formId}`);
  localStorage.removeItem(`form_submitted_${formId}`);
  localStorage.removeItem(`form_closed_${formId}`);
}

function isFormClosed(formId) {
  return !!localStorage.getItem(`form_closed_${formId}`);
}

function setFormClosed(formId, closed) {
  if (closed) {
    localStorage.setItem(`form_closed_${formId}`, "1");
  } else {
    localStorage.removeItem(`form_closed_${formId}`);
  }
}

export default function MyForms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" || !stored;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const loadForms = useCallback(() => {
    if (user?.email) {
      const loaded = getAllForms(user.email).map((form) => ({
        ...form,
        closed: isFormClosed(form.id),
      }));
      setForms(loaded);
    }
  }, [user]);

  useEffect(() => {
    loadForms();
    const onStorage = () => loadForms();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadForms]);

  const handleDelete = (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      deleteForm(formId);
      setForms((current) => current.filter((f) => f.id !== formId));
      toast.success("Form deleted successfully.");
    }
  };

  const handleToggleClosed = (formId) => {
    setForms((current) => {
      const updated = current.map((f) => {
        if (f.id === formId) {
          const newClosed = !f.closed;
          setFormClosed(formId, newClosed);
          return { ...f, closed: newClosed };
        }
        return f;
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen max-w-a mx-auto p-6 bg-blue-950">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 transition-all duration-500">
          My Published Forms
        </h2>
      </div>

      {forms.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No forms published yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li
              key={form.id}
              className="bg-white dark:bg-gray-200 shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-500"
            >
              <div>
                <div className="font-semibold text-lg">
                  {form.title || "Untitled Form"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                  Link:{" "}
                  <a
                    href={`/form/${form.id}`}
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {window.location.origin}/form/{form.id}
                  </a>
                </div>
                <div className="text-sm mt-1">
                  Status:{" "}
                  {form.closed ? (
                    <span className="text-red-600">Closed</span>
                  ) : (
                    <span className="text-green-600">Open</span>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-2 md:mt-0 flex-wrap">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/form/${form.id}`)}
                >
                  View Form
                </button>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    exportToExcel(
                      getResponses(form.id),
                      form.title || "responses"
                    )
                  }
                >
                  Download Responses
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleToggleClosed(form.id)}
                >
                  {form.closed ? "Open Form" : "Close Form"}
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(form.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

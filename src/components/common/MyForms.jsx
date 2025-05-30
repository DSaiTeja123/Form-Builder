import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { exportToExcel } from "../../utils/exportExcel";

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

  const handleExportExcel = (formId, formTitle) => {
    const form = JSON.parse(localStorage.getItem(`form_${formId}`));
    const responses = getResponses(formId);
    if (!responses.length) {
      toast.info("No responses yet for this form.");
      return;
    }
    exportToExcel(responses, form, formTitle || "responses");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 bg-blue-950 dark:bg-gray-900 transition-colors duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 transition-all duration-500">
          My Published Forms
        </h2>
        {/* Optional place for a new form button or filter if you want */}
      </div>

      {forms.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center sm:text-left">
          No forms published yet.
        </div>
      ) : (
        <ul className="space-y-6">
          {forms.map((form) => (
            <li
              key={form.id}
              className="bg-white dark:bg-gray-800 shadow rounded p-5 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-500"
            >
              <div className="flex flex-col gap-1 md:max-w-xl">
                <div className="font-semibold text-lg truncate">
                  {form.title || "Untitled Form"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 break-words">
                  Link:{" "}
                  <a
                    href={`/form/${form.id}`}
                    className="text-indigo-600 underline truncate block md:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${window.location.origin}/form/${form.id}`}
                  >
                    {window.location.origin}/form/{form.id}
                  </a>
                </div>
                <div className="text-sm mt-1">
                  Status:{" "}
                  {form.closed ? (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      Closed
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      Open
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => navigate(`/form/${form.id}`)}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                >
                  View Form
                </button>
                <button
                  onClick={() => handleExportExcel(form.id, form.title)}
                  className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
                >
                  Download Responses
                </button>
                <button
                  onClick={() => handleToggleClosed(form.id)}
                  className="px-4 py-2 rounded-2xl bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 text-sm font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-700 active:bg-yellow-600 dark:active:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition"
                >
                  {form.closed ? "Open Form" : "Close Form"}
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="px-4 py-2 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition"
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

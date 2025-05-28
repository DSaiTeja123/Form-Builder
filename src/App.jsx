import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import FormBuilder from "./components/builder/FormBuilder";
import MyForms from "./components/common/MyForms";
import PublicForm from "./components/common/PublicForm";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={<Login onSwitch={() => setShowRegister(true)} />}
            />
            <Route
              path="/register"
              element={<Register onSwitch={() => setShowRegister(false)} />}
            />
            <Route path="/my-forms" element={<MyForms />} />
            <Route path="/views" element={<FormBuilder render="views" />} />
            <Route path="/form/:formId" element={<PublicForm />} />
            <Route path="/" element={<FormBuilder />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

Project: FormBuilder
Abstract
FormBuilder is a modern, intelligent form creation platform that empowers users to design, publish, and manage custom forms with ease. The system provides a seamless drag-and-drop interface for building forms, supports advanced field types (including file upload, signature pad, sliders, ratings, and more), and enables users to preview forms in multiple device modes. With robust authentication and dynamic theming (dark/light mode), FormBuilder ensures a secure and personalized experience. Built with React.js and Tailwind CSS, the platform leverages local storage for persistence and integrates Excel export functionality for efficient data analysis. FormBuilder bridges the gap between user-friendly form design and powerful data collection, making it ideal for surveys, registrations, feedback, and more.

Features
Visual Form Builder
Drag-and-drop interface for adding basic and advanced fields.

Multi-step form creation with customizable step names.

Real-time preview in desktop, tablet, and mobile views.

Advanced Field Types
File Upload: Accepts user file submissions.

Signature Pad: Collects digital signatures.

Slider & Rating: Interactive numeric and star-based inputs.

Color Picker, Switch, Time Picker: Modern input controls.

Repeater & Matrix/Grid: Dynamic lists and tabular inputs.

Rich Text Editor: Supports formatted text responses.

Section Headers: For clear form organization.

Authentication & Access Control
Only logged-in users can create, edit, or delete forms.

Anyone with a published form link can submit responses.

Data Management
View, manage, and export form responses as Excel files with user-friendly column names.

Persistent storage using browser localStorage.

Theming & UI
Toggle between dark and light modes.

Responsive, accessible design.

Dynamic navbar adapts to authentication state.

Routing & Deployment
SPA routing with Vercel support (vercel.json included for client-side routing).

Public forms accessible via unique URLs.

Technology Stack
Frontend: React.js, Tailwind CSS, react-hook-form, react-toastify, xlsx, react-signature-canvas

State/Context: React Context API for authentication and theming

Persistence: Browser localStorage

Deployment: Vercel (with SPA routing support)

Project Structure
text
src/
├── components/
│   ├── builder/         # Form builder and preview components
│   ├── common/          # Navbar, MyForms, Views, etc.
│   └── auth/            # Login, Register
├── context/             # Auth and Theme context
├── pages/               # Home, etc.
├── utils/               # Excel export, etc.
├── App.jsx
└── index.js
vercel.json              # SPA routing config for Vercel
Data Flow & Key Modules
Form Creation
Users drag fields from the toolbox into the builder canvas.

Each field has customizable configuration (label, options, validation).

Steps and fields are stored in localStorage.

Form Preview & Submission
Users preview forms in various device modes.

Published forms are accessible to anyone with the link.

Responses are validated and stored locally.

Response Management
Authenticated users can view and export responses.

Excel export provides readable column headers using field labels.

Theming
Users can toggle between dark and light mode.

Theme preference is saved and respects system settings.

Example Usage
Register/Login to access the form builder.

Create a form using drag-and-drop.

Preview and publish the form.

Share the link with others for submissions.

View and export responses as Excel.


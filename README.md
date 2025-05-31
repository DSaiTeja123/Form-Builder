# FormBuilder

A modern, customizable form builder built with React and Tailwind CSS.  
**Authenticated users** can visually create, manage, and share forms using a drag-and-drop interface.  
**Anyone** with a published form link can fill out and submit responses.

---

## ✨ Features

- **Drag-and-drop form builder** with basic and advanced fields
- **Multi-step forms** with progress indicator
- **Dynamic preview** for desktop, tablet, and mobile
- **Dark/light theme** (Tailwind CSS, system-aware, toggle in UI)
- **Authentication** (only logged-in users can create/manage forms)
- **Dynamic Navbar** (shows login/register for guests, form management for users)
- **Excel export** with user-friendly column names
- **Client-side routing** (SPA, works on Vercel with `vercel.json`)
- **Persistent forms and responses** (localStorage)
- **Advanced fields:** file upload, signature pad, slider, rating, color picker, switch, time picker, section header, repeater, matrix/grid, rich text editor
- **Responsive design**

---

## 🚀 Demo

**Live:** [https://form-builder-omega-one.vercel.app/](https://form-builder-omega-one.vercel.app/)

---

## 📦 Installation

1. **Clone the repository**
git clone https://github.com/your-username/form-builder.git
cd form-builder

2. **Install dependencies**
npm install

3. **Start the development server**
npm run dev


4. **Open in your browser:**  
[http://localhost:5173](http://localhost:5173)

---

## 🛠️ Usage

- **Register/Login** to access the form builder.
- **Create forms** by dragging fields from the toolbox.
- **Preview** your form in different device modes.
- **Publish** to get a shareable link.
- **View responses** and export as Excel.
- **Anyone** with the link can fill out the form.

---

## 🌓 Dark/Light Theme

- Toggle theme using the button in the navbar.
- Theme preference is saved and respects system defaults.
- Implemented using Tailwind CSS `darkMode: 'class'`.

---

## 🌐 Deployment

**Vercel:**  
- The included `vercel.json` ensures all client-side routes work.
- Just push to your GitHub repo and import in Vercel.

## 🧩 Tech Stack

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-hook-form](https://react-hook-form.com/)
- [react-signature-canvas](https://www.npmjs.com/package/react-signature-canvas)
- [react-toastify](https://fkhadra.github.io/react-toastify/)
- [xlsx](https://github.com/SheetJS/sheetjs)
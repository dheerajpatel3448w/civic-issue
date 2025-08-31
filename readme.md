# 🛠️ Complaint Management & Worker Task Assignment System

A full-stack web application to manage civic complaints, assign tasks to workers, and notify them via **Email** or **WhatsApp**.  
Workers receive a secure link to view and complete tasks.

---

## 🚀 Features
- Citizens can register complaints about civic issues (garbage, potholes, etc.)
- Admins assign complaints as tasks to available workers
- Workers get **email notifications** with a unique secure link
- JWT token-based secure task links
- Fully responsive frontend (React / Vite)
- Backend with Node.js, Express, and MongoDB

---

## 🏗️ Tech Stack
### Frontend:
- React + Vite
- Tailwind CSS
- Axios for API calls

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- Nodemailer for emails
- Twilio API (optional) for WhatsApp

---

## 📂 Folder Structure
project/
├── backend/ # Express backend with API routes
├── frontend/ # React frontend
├── .env # Environment variables
├── README.md # Project documentation
└── package.json # Dependencies
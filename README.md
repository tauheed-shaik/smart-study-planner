# 🎓 Smart Study Planner

A state-of-the-art AI-powered MERN application designed to optimize student productivity through intelligent scheduling, gamified task management, and interactive AI assistance.

![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![API Status](https://img.shields.io/badge/API-100%25_Success-brightgreen)
![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-gold)

## 🌟 Features

- **🛡️ Secure Authentication**: JWT-based registration and login system.
- **📊 Dynamic Dashboard**: Real-time overview of tasks, analytics, and gamification progress.
- **📚 Subject Context**: Color-coded subject management to help the AI understand your syllabus.
- **✅ Smart Tasks**: Task tracking with priority levels and automatic point calculation.
- **🤖 AI Study Planner**: A sophisticated engine that analyzes your workload and generates a personalized 7-day calendar.
- **💬 AI Study Buddy**: A floating chatbot linked to Groq's high-performance AI for instant academic help.
- **🏆 Gamification**: Earn experience points (XP) and level up as you complete your goals.
- **📄 Pro Exports**: Export your generated study schedule into a professional-grade PDF.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Engine**: Groq API (Powered by Llama 3)
- **PDF Engine**: jsPDF & AutoTable

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB connection string
- Groq Cloud API Key

### Installation

1. **Clone the project** and navigate to the root directory.
2. **Install all dependencies** (Root, Backend, and Frontend):
   ```bash
   npm run install-all
   ```
3. **Configure Environment**:
   Ensure `backend/.env` is set up with your credentials (pre-configured for this workspace).

### Running the Application
The application is configured for concurrent execution:
```bash
npm start
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

---

## 🧪 API Test Results

Comprehensive testing was performed on all endpoints on **February 10, 2026**. All tests passed with 100% success rate.

| Category | Endpoint | Method | Result | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | ✅ PASSED | New user creation valid |
| **Auth** | `/api/auth/login` | `POST` | ✅ PASSED | JWT token generation successful |
| **Auth** | `/api/auth/me` | `GET` | ✅ PASSED | Profile retrieval verified |
| **Subjects** | `/api/subjects` | `POST` | ✅ PASSED | Custom color markers stored |
| **Subjects** | `/api/subjects` | `GET` | ✅ PASSED | Multi-user data isolation verified |
| **Tasks** | `/api/tasks` | `POST` | ✅ PASSED | Priority & Deadline handling valid |
| **Tasks** | `/api/tasks/:id` | `PUT` | ✅ PASSED | **Gamification: XP points awarded** |
| **AI** | `/api/ai/chat` | `POST` | ✅ PASSED | Real-time Groq response received |
| **AI** | `/api/ai/generate-plan` | `POST` | ✅ PASSED | Valid JSON Schedule generated |

---

## 🏗️ Project Structure
```text
smart-study-planner/
├── backend/            # Express Server & AI Logic
└── frontend/           # React App & Design System
    ├── src/
    │   ├── api.js      # Centralized API Config
    │   ├── context/    # Auth & State Management
    │   ├── components/ # Reusable UI Modules
    │   └── pages/      # Application Views
```

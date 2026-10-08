# Addy Job - Full Stack Project

Full-stack web application structure with **Next.js** for the frontend and **Node.js + Express (TypeScript)** for the backend.

---

## 📁 Project Structure

```text
addy_job/
├── client/                     # Frontend (Next.js 15+ App Router)
│   ├── src/
│   │   └── app/                # App Router pages and layouts
│   ├── public/                 # Static assets
│   ├── .env.local              # Client environment variables
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── server/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/        # Request controllers
│   │   ├── routes/             # Express API routes
│   │   └── index.ts            # Server entry point
│   ├── .env                    # Server environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Dependencies Install Karein
Root folder me ya dono folders me alag-alag:

```bash
# Dono client aur server dependencies install karne ke liye:
npm run install:all
```

---

### 2. Development Servers Start Karein

Aap root folder se commands run kar sakte hain ya directly folders ke andar ja kar:

#### Root se:
```bash
# Terminal 1 - Frontend (Next.js):
npm run dev:client

# Terminal 2 - Backend (Express API):
npm run dev:server
```

#### Alag-Alag Folder Se:
```bash
# Client:
cd client
npm run dev

# Server:
cd server
npm run dev
```

---

## 🌐 URLs & Ports

- **Client (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **Server (Backend API)**: [http://localhost:5000](http://localhost:5000)
  - API Health: [http://localhost:5000/api/health](http://localhost:5000/api/health)
  - API Welcome: [http://localhost:5000/api/welcome](http://localhost:5000/api/welcome)

---

## ⚙️ Environment Variables

- **Client (`client/.env.local`)**:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  ```

- **Server (`server/.env`)**:
  ```env
  PORT=5000
  NODE_ENV=development
  CLIENT_URL=http://localhost:3000
  ```

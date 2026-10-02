# Tasker — High-Velocity Project Orchestration

<div align="center">
  <img src="client/public/logo.png" alt="Tasker Logo" width="80" height="80" />
  <br />
  <p><strong>A tactile, high-craft agile project orchestration platform built for high-velocity software teams. Zero ceremonial drag.</strong></p>

  <p>
    <a href="https://tasker-pm.vercel.app/" target="_blank"><strong>View Live Application ↗</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
    <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux Toolkit" />
    <img src="https://img.shields.io/badge/TailwindCSS-v3-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" />
  </p>
</div>

---

## ⚡ Overview: The Architect's Ledger

**Tasker** is an agile project and task management system designed to eliminate context-switching and configuration labyrinths. Rather than burying work beneath enterprise clutter, Tasker treats every task, stage, and sprint as an architectural blueprint: clear structural lines, high-contrast typography, and sub-80ms interactions.

### Core Philosophy
- **Speed Over Ceremony:** Transition stages, assign teammates, and check off subtasks in a single interaction without full-page reloads.
- **Visual Scanability:** Overdue milestones, priority alerts, and stage progressions are immediately discernible through structured color hierarchy and typography.
- **Zero Dead Ends:** Every state—whether an empty trash bin, route error, or offline state—provides an instant path forward.

---

## ✨ Features & Architecture

### 📋 Interactive Drag & Drop Kanban
- Multi-stage pipeline (**To Do**, **In Progress**, **Completed**) powered by `@hello-pangea/dnd`.
- Optimistic local state updates with automatic server rollback on network errors.
- Priority tagging (**Urgent**, **High**, **Normal**, **Low**) with visual indicators.
- Subtask checklists with automatic sprint completion calculations.

### ⌨️ Universal Command Palette (`⌘K` / `Ctrl+K`)
- Instant keyboard launcher for fuzzy-searching tasks and quick navigation across all views.
- Quick stage filters, theme switching, and action execution without lifting fingers from the keys.

### 🌊 Hardware-Accelerated Smooth Scrolling
- Integrated **Lenis** inertia scrolling delivering butter-smooth 120fps navigation.
- Calibrated navbar offset clearance ensuring header anchors land with exact spacing.

### 🌓 Adaptive Obsidian Theme Engine
- Dual dark/light theme architecture with noise grain overlay.
- High-contrast obsidian base palette (`#08090d`, `#10121a`) paired with refined cadmium cobalt accents (`#2563eb`).
- Persisted user preference via `localStorage` with zero theme flash.

### 🛡️ Hardened Security Architecture
- **Stateless Session Security:** Cryptographically signed JWT tokens delivered via `httpOnly`, `SameSite: None`, `Secure` cookies—immune to client-side XSS token extraction.
- **OWASP Defense-in-Depth:**
  - **Helmet HTTP Headers** for clickjacking and MIME-type sniffing prevention.
  - **NoSQL Injection Sanitization** stripping malicious query operators (`$gt`, `$ne`).
  - **Express Rate Limiting** mitigating credential stuffing and DoS attacks.
  - **Payload Size Caps** restricting body parsing to prevent memory exhaustion.

### 📱 Responsive & Mobile-Optimized
- Mobile drawer navigation with backdrop blur.
- Floating glassmorphic **Sticky Mobile Conversion CTA** for mobile landing page visitors.

### 📈 Web Analytics & Standards
- Privacy-preserving real-time visitor metrics via `@vercel/analytics`.
- Production SEO setup: [`robots.txt`](client/public/robots.txt), [`sitemap.xml`](client/public/sitemap.xml), Open Graph cards, and Twitter summary metadata.
- PWA-ready [`site.webmanifest`](client/public/site.webmanifest) and high-resolution icon set.
- Built-in legal transparency with dedicated [`/privacy`](client/src/pages/Privacy.jsx) and [`/terms`](client/src/pages/Terms.jsx) pages.
- Custom architectural [`/404`](client/src/pages/NotFound.jsx) diagnostic page.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 6, React Router DOM v7 |
| **State & Data Fetching** | Redux Toolkit (RTK), RTK Query with tag invalidation |
| **Styling & Icons** | Tailwind CSS, Lucide React, React Icons |
| **Motion & Interaction** | Lenis Smooth Scroll, Headless UI, `@hello-pangea/dnd` |
| **Telemetry & Alerts** | Sonner Toaster, Recharts, `@vercel/analytics` |
| **Backend Runtime** | Node.js (v20+), Express.js 4 |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security & Middleware** | Cookie Parser, Helmet, Express Rate Limit, Morgan |
| **Asset Storage** | Cloudinary CDN |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Client["Client: React 19 + Vite (port 3000)"]
    subgraph Browser["Browser Runtime"]
        Client --> RTK["Redux Toolkit / RTK Query"]
        Client --> Lenis["Lenis Inertia Scrolling"]
        Client --> DND["@hello-pangea/dnd Kanban"]
        Client --> Analytics["@vercel/analytics"]
    end

    subgraph SecurityBoundary["Security & Middleware Layer"]
        Helmet["Helmet Security Headers"]
        RateLimit["Rate Limiter (DoS Defense)"]
        Sanitize["NoSQL Sanitizer"]
        CookieAuth["httpOnly Cookie Parser"]
    end

    subgraph Server["Backend: Express 4 (port 8800)"]
        Routes["REST API Routes: /api/*"]
        AuthMiddleware["verifyToken Middleware"]
        Controllers["Controllers (Tasks, Users, Auth)"]
    end

    subgraph Database["Data Layer"]
        Mongo[("MongoDB Atlas")]
        Cloudinary[("Cloudinary CDN")]
    end

    Client -->|HTTPS + Credentials| SecurityBoundary
    SecurityBoundary --> Routes
    Routes --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Mongo
    Client -.->|Direct Image Upload| Cloudinary
```

---

## 📁 Repository Structure

```
Tasker/
├── client/                      # React 19 Frontend
│   ├── public/
│   │   ├── googlefaf7226c098585ff.html # Google Search Console verification
│   │   ├── robots.txt           # Search crawler directives
│   │   ├── site.webmanifest     # PWA manifest
│   │   ├── sitemap.xml          # Canonical XML sitemap
│   │   └── logo.png / tasker.ico # Brand icon assets
│   ├── src/
│   │   ├── assets/              # Static styling assets
│   │   ├── components/          # Reusable UI primitives
│   │   │   ├── tasks/           # TaskDialog, AddTask, UserList, BoardView
│   │   │   ├── Navbar.jsx       # Workspace navigation & search bar
│   │   │   ├── Sidebar.jsx      # Desktop navigation links
│   │   │   ├── CommandPalette.jsx # ⌘K universal command launcher
│   │   │   └── Table.jsx        # Data tables with sorting & actions
│   │   ├── pages/               # Application routes
│   │   │   ├── LandingPage.jsx  # Architectural product landing page
│   │   │   ├── Login.jsx        # Authentication & demo quick-launch
│   │   │   ├── Dashboard.jsx    # Metrics overview & sprint telemetry
│   │   │   ├── Tasks.jsx        # Interactive Kanban & list view
│   │   │   ├── MyTasks.jsx      # Member assigned tasks
│   │   │   ├── ActivityFeed.jsx # System activity stream
│   │   │   ├── CalendarView.jsx # Milestones & deadline calendar
│   │   │   ├── Users.jsx        # Admin team directory management
│   │   │   ├── Trash.jsx        # Soft-deleted task recovery
│   │   │   ├── Privacy.jsx      # Legal data & cookie policy
│   │   │   ├── Terms.jsx        # Terms of service & governance
│   │   │   └── NotFound.jsx     # Diagnostic 404 route handler
│   │   ├── redux/               # Store configuration & RTK Query slices
│   │   │   ├── slices/          # authSlice, apiSlice, userApiSlice, taskApiSlice
│   │   │   └── store.js
│   │   ├── utils/               # ThemeContext, formatters, helpers
│   │   ├── App.jsx              # Routing & dynamic document.title listener
│   │   └── main.jsx
│   ├── index.html               # Open Graph, Twitter Cards, Typography preconnects
│   ├── vite.config.js           # Vite configuration (port 3000, manualChunks)
│   └── package.json
├── server/                      # Express Backend
│   ├── controllers/             # authController, taskController, userController
│   ├── middlewares/             # errorMiddleware, sanitizeMiddleware, authMiddleware
│   ├── models/                  # taskModel, userModel, notificationModel
│   ├── routes/                  # Express route routers
│   ├── utils/                   # dbConnection, createJWT cookie handler
│   ├── index.js                 # Server entry point (port 8800)
│   └── package.json
├── PRODUCT.md                   # Product specs & user personas
├── DESIGN.md                    # Design tokens & color system
└── README.md                    # Project documentation
```

---

## ⚙️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- [Cloudinary](https://cloudinary.com/) account (free tier for task attachment uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/AviralMehrotra/Tasker.git
cd Tasker
```

### 2. Configure & Start Backend
```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:
```env
PORT=8800
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret_key
```

Start the backend API server:
```bash
npm run dev
```
> The API server will initialize at `http://localhost:8800`.

### 3. Configure & Start Frontend
Open a separate terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `/client` directory:
```env
VITE_SERVER_API=http://localhost:8800/api
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<your_cloud_name>/upload
VITE_CLOUDINARY_PRESET=<your_upload_preset>
```

Start the frontend Vite development server:
```bash
npm run dev
```
> The frontend application will run at **`http://localhost:3000`**.

---

## 🔑 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Required | Description | Example / Default |
|---|:---:|---|---|
| `PORT` | No | Port on which Express server listens | `8800` |
| `NODE_ENV` | Yes | Runtime environment mode | `development` / `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/tasker` |
| `JWT_SECRET` | Yes | Cryptographic secret for signing tokens | `super_secure_random_hash_string` |

### Frontend (`client/.env`)
| Variable | Required | Description | Example / Default |
|---|:---:|---|---|
| `VITE_SERVER_API` | Yes | Base URL for backend REST endpoints | `http://localhost:8800/api` |
| `VITE_CLOUDINARY_URL` | No | Cloudinary unsigned REST upload endpoint | `https://api.cloudinary.com/v1_1/<cloud_name>/upload` |
| `VITE_CLOUDINARY_PRESET` | No | Unsigned Cloudinary upload preset name | `tasker_uploads` |

---

## 📚 REST API Reference

### Authentication & Users (`/api/user`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/user/register` | Register new user account | Public |
| `POST` | `/api/user/login` | Authenticate credentials & set `token` cookie | Public |
| `POST` | `/api/user/logout` | Clear session cookie | Authenticated |
| `GET` | `/api/user/get-team` | Fetch team directory and profile metadata | Authenticated |
| `GET` | `/api/user/notifications` | Fetch unread notifications | Authenticated |
| `PUT` | `/api/user/profile` | Update account profile | Authenticated |
| `PUT` | `/api/user/change-password` | Update account password | Authenticated |
| `DELETE` | `/api/user/:id` | Remove user from workspace | Admin Only |

### Tasks & Kanban (`/api/task`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/task/create` | Create a new task with subtasks & attachments | Authenticated |
| `GET` | `/api/task` | Fetch tasks with stage/priority filters & search | Authenticated |
| `GET` | `/api/task/dashboard` | Fetch aggregate metrics, charts & sprint telemetry | Authenticated |
| `GET` | `/api/task/:id` | Fetch detailed task card with activity timeline | Authenticated |
| `PUT` | `/api/task/update/:id` | Update task fields (title, priority, stage, dates) | Authenticated |
| `POST` | `/api/task/activity/:id` | Post timestamped comment / status event | Authenticated |
| `PUT` | `/api/task/create-subtask/:id` | Append checklist subtask | Authenticated |
| `PUT` | `/api/task/:id` | Soft-delete task to Trash Bin | Authenticated |
| `DELETE` | `/api/task/delete-restore/:id` | Restore from Trash or permanently delete | Authenticated |

---

## 🚢 Deployment

Tasker is optimized for rapid cloud deployment:

- **Frontend:** Hosted seamlessly on [Vercel](https://vercel.com/) with native Single-Page Application rewrites and `@vercel/analytics` support.
  - Production URL: [https://tasker-pm.vercel.app/](https://tasker-pm.vercel.app/)
- **Backend:** Deployable to [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/) as a persistent Node service.
- **Database:** Hosted on MongoDB Atlas with compound indexes on `{ stage: 1, isTrashed: 1 }` for high-throughput queries.

---

## 🤝 Contributing

Contributions, feature suggestions, and issues are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with focus, discipline, and craft by <a href="https://github.com/AviralMehrotra">Aviral Mehrotra</a>.</sub>
</div>

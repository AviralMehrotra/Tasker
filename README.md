# Tasker

A full-stack Project Management application built with React, Redux Toolkit, Node.js, Express, and MongoDB. This app allows teams to manage tasks, assign users, track progress, and handle notifications with a modern, responsive UI.

---

## 🚀 Project Overview

Task Manager is designed for collaborative teams to:
- Create, update, and delete tasks
- Assign users to tasks
- Track task progress and stages
- Manage subtasks
- View statistics and charts
- Handle notifications
- Trash and restore tasks
- Secure authentication with JWT

---

## ✨ Features
- **User Authentication** (JWT, role-based: Admin/User)
- **Task CRUD** (Create, Read, Update, Delete)
- **Subtasks** and activity tracking
- **Board and Table Views** for tasks
- **Trash/Restore** functionality
- **User management** (Admin only)
- **Notifications** panel
- **Responsive UI** (Tailwind CSS)
- **Statistics Dashboard**

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **State Management:** Redux Toolkit Query

---

## 📁 Folder Structure

```
Task Manager/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── ...
│   ├── public/
│   └── ...
├── server/           # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── ...
└── README.md
```

## 🚀 Deployment

The Task Manager app is live!

**Live Demo:** [Tasker](https://tasker-tm.netlify.app/)

You can try out all features directly on the hosted site.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/AviralMehrotra/Tasker.git
cd Tasker
```

### 2. Setup the Backend
```bash
cd server
npm install
```
- Create a `.env` file in `/server` with:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the backend:
  ```bash
  npm run dev
  # or
  npm start
  ```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```
- The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## 🔑 Environment Variables

**Backend (`/server/.env`):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default: 5000)

**Frontend:**
- Cloudniary API and URL
- Your Backend API 

---

## 🧑‍💻 Usage
- Register or login as a user or admin
- Create and manage tasks
- Assign users to tasks
- Move tasks between stages (To Do, In Progress, Completed)
- Trash or restore tasks
- View statistics and notifications
- Admins can manage users

---

## 📚 API Overview

- **Auth:** `/api/auth/login`, `/api/auth/register`, `/api/auth/change-password`
- **Tasks:** `/api/tasks`, `/api/tasks/:id`, `/api/tasks/create`, `/api/tasks/update/:id`, `/api/tasks/delete-restore/:id`
- **Users:** `/api/users`, `/api/users/:id`
- **Notifications:** `/api/notifications`

(See code for detailed request/response formats.)

---

## 🤝 Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

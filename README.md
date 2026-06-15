# TaskFlow — MERN Task Management Dashboard

A full-stack task management dashboard built with the **MERN** stack (MongoDB, Express, React, Node). It features JWT authentication, a drag-and-drop Kanban board, a sortable list view, and an analytics page — wrapped in a premium dark, glassmorphic UI.

> **Live demo:** _add your Vercel URL here after deploying_
> **Demo login:** `demo@taskflow.app` / `demo123` (after running the seed script)

---

## Features

**Auth**
- Email + password signup / login
- JWT-based sessions, protected API routes
- Each user only sees their own tasks

**Task management**
- Create, edit, delete tasks with title, description, priority, status, due date, assignee
- Drag-and-drop Kanban board (To Do / In Progress / Done) powered by `@dnd-kit`
- Sortable list view (sort by title, status, priority, due date, assignee)
- Task modal with full edit + delete
- Filter by priority and assignee; live search by title

**Dashboard & analytics**
- Stat cards: Total, Completed, In Progress, Overdue
- Donut chart for status breakdown + completion rate
- Bar chart for tasks by priority
- Recent activity feed

**UI/UX**
- Deep navy background, electric indigo accents, emerald success, warm-white cards
- Glassmorphism with backdrop blur, Framer Motion animations, loading skeletons
- Collapsible sidebar, fully responsive (mobile Kanban scrolls horizontally)
- Inter font, dark mode

---

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 18 (Vite), Tailwind CSS, Framer Motion, @dnd-kit, Recharts, Lucide, Axios, React Router |
| Backend  | Node, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas |

---

## Project structure

```
task-dashboard/
├── server/            # Express API
│   ├── config/db.js
│   ├── models/        # User, Task
│   ├── middleware/    # JWT auth
│   ├── routes/        # auth, tasks
│   ├── seed.js        # demo data
│   └── server.js
└── client/            # React + Vite app
    ├── src/
    │   ├── components/
    │   ├── context/   # AuthContext
    │   ├── pages/     # Login, Register, Dashboard
    │   ├── lib/
    │   └── api.js
    └── index.html
```

---

## Run locally

### 1. Prerequisites
- Node.js 18+
- A MongoDB connection string (free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or local `mongod`)

### 2. Backend
```bash
cd server
npm install
cp .env.example .env        # then edit .env (see below)
npm run seed                # optional: creates demo user + sample tasks
npm run dev                 # starts API on http://localhost:5000
```

`server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow
JWT_SECRET=any_long_random_string
PORT=5000
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env        # set VITE_API_URL=http://localhost:5000
npm run dev                 # opens http://localhost:5173
```

Visit **http://localhost:5173**, register an account (or use the demo login), and start adding tasks.

---

## Deploy live (free tier)

You'll deploy three things: the **database** (Atlas), the **API** (Render), and the **frontend** (Vercel).

### A. MongoDB Atlas
1. Create a free account → **Build a Database** → **M0 (free)**.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
4. **Connect** → **Drivers** → copy the connection string. Replace `<password>` and add a db name, e.g. `.../taskflow`.

### B. Push to GitHub
```bash
cd task-dashboard
git init
git add .
git commit -m "TaskFlow MERN dashboard"
git branch -M main
git remote add origin https://github.com/<you>/task-dashboard.git
git push -u origin main
```

### C. Backend on Render
1. [render.com](https://render.com) → **New** → **Web Service** → connect your repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment variables:**
   - `MONGO_URI` = your Atlas string
   - `JWT_SECRET` = a long random string
6. Deploy. Copy the service URL, e.g. `https://taskflow-api.onrender.com`.

> Optional: run the seed once via Render's **Shell** tab: `npm run seed`.

### D. Frontend on Vercel
1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo.
2. **Root Directory:** `client`
3. Framework preset: **Vite** (auto-detected).
4. **Environment variable:** `VITE_API_URL` = your Render API URL (no trailing slash).
5. Deploy. Your live link is the Vercel URL.

Then add both links to your project submission. Paste either the **GitHub** repo link or the **live (Vercel)** link in the ScholarX form.

---

## API reference

| Method | Endpoint            | Auth | Description            |
|--------|---------------------|------|------------------------|
| POST   | `/api/auth/register`| no   | Create account         |
| POST   | `/api/auth/login`   | no   | Log in, returns token  |
| GET    | `/api/auth/me`      | yes  | Current user           |
| GET    | `/api/tasks`        | yes  | List your tasks        |
| POST   | `/api/tasks`        | yes  | Create a task          |
| PUT    | `/api/tasks/:id`    | yes  | Update a task          |
| DELETE | `/api/tasks/:id`    | yes  | Delete a task          |

Send the token as `Authorization: Bearer <token>`.

---

Built for the ScholarX internship project.

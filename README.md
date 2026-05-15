# TaskFlow

A full-stack task management app with JWT authentication. Create an account, log in, and manage your tasks with priorities and filters — all saved in the cloud.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb) ![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)

## Features

- JWT authentication — register, login, protected routes
- Create, edit, delete and complete tasks
- Priority levels — High, Medium, Low
- Filter by status and priority
- Real-time stats dashboard
- Fully responsive UI

## Tech Stack

**Frontend:** React 18, Vite, CSS Modules  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT + bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free) → [mongodb.com/atlas](https://mongodb.com/atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Project Structure

```
backend/
├── src/
│   ├── models/        # User and Task schemas
│   ├── routes/        # Auth and task routes
│   ├── middleware/    # JWT protection
│   └── server.js      # Express entry point
frontend/
└── src/
    ├── context/       # Auth context with JWT
    └── pages/         # AuthPage and TasksPage
```

## Deployment

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas)

## License

MIT

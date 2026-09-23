# MITRA Attendance Portal

Monorepo for the Vishnu Institute of Technology attendance portal.

## Structure

- `frontend/`: Vite React application
- `backend/`: Express API

## Setup

```bash
npm install
npm run dev
```

The root `dev` script starts both applications. Use `npm run frontend` or `npm run backend` to start one application independently.

Copy `.env.example` to the appropriate app environment file and provide the required Firebase/Supabase configuration.

## Scripts

- `npm run dev`: start frontend and backend together
- `npm run frontend`: start Vite
- `npm run backend`: start Express with nodemon
- `npm run build`: build the frontend
- `npm run lint`: lint the frontend

# Conference Connect — Setup Guide

## Project Structure

```
conference-connect/
├── backend/
│   ├── server.js            ← Express + Socket.io entry point
│   ├── package.json
│   ├── .env.example         ← Copy this to .env and fill in your credentials
│   └── src/
│       ├── sessions.js      ← Hardcoded conference session data
│       ├── passport.js      ← LinkedIn OAuth2 strategy configuration
│       ├── authRoutes.js    ← /auth/* routes (login, callback, me, logout)
│       ├── sessionRoutes.js ← /api/sessions route
│       └── socketHandlers.js← All Socket.io event handlers
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx         ← Entry point (BrowserRouter wraps App)
        ├── App.jsx          ← All routes defined here
        ├── index.css        ← Global styles
        ├── context/
        │   └── AuthContext.jsx    ← Global auth state (useAuth hook)
        ├── components/
        │   ├── AppNavbar.jsx      ← Navbar with user info + nav links
        │   ├── ProtectedRoute.jsx ← Redirects to /login if not authenticated
        │   └── SessionCard.jsx    ← Reusable session card (Dashboard + Schedule)
        └── pages/
            ├── LoginPage.jsx          ← LinkedIn sign-in button
            ├── DashboardPage.jsx      ← All sessions card grid
            ├── MySchedulePage.jsx     ← Saved sessions
            ├── ActiveSessionsPage.jsx ← Live rooms with real-time counts
            └── LiveSessionPage.jsx    ← Chat room with Socket.io
```

---

## Step 1 — Get LinkedIn OAuth Credentials

You need a LinkedIn Developer App to use LinkedIn OAuth.

1. Go to **https://www.linkedin.com/developers/**
2. Click **Create App**
3. Fill in:
   - App name: `Conference Connect`
   - LinkedIn Page: your personal LinkedIn page URL
   - App Logo: any image
4. Under **Auth** tab, add this **Authorized Redirect URL**:
   ```
   http://localhost:5000/auth/linkedin/callback
   ```
5. Under **Products**, request access to **Sign In with LinkedIn using OpenID Connect**
6. Copy your **Client ID** and **Client Secret**

---

## Step 2 — Configure Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
SESSION_SECRET=any_long_random_string_here

LINKEDIN_CLIENT_ID=your_client_id_from_step_1
LINKEDIN_CLIENT_SECRET=your_client_secret_from_step_1
LINKEDIN_CALLBACK_URL=http://localhost:5000/auth/linkedin/callback

FRONTEND_URL=http://localhost:5173
```

> ⚠️ Never commit `.env` to version control. The `.gitignore` excludes it.

---

## Step 3 — Install and Run the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Conference Connect backend running on http://localhost:5000
```

---

## Step 4 — Install and Run the Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

---

## Step 5 — Open the App

Navigate to **http://localhost:5173** in your browser.

You will be redirected to `/login`. Click **Sign in with LinkedIn**.

---

## How It Works (Architecture Overview)

### Authentication Flow
1. User clicks "Sign in with LinkedIn"
2. Frontend redirects to `http://localhost:5000/auth/linkedin`
3. Backend (Passport.js) redirects to LinkedIn's OAuth consent page
4. LinkedIn sends user back to `http://localhost:5000/auth/linkedin/callback`
5. Passport extracts the user profile and stores it in the Express session
6. Backend redirects the browser to `http://localhost:5173/dashboard`
7. On every page load, React calls `GET /auth/me` to restore session state

### Protected Routes
- `ProtectedRoute.jsx` checks `user` from `AuthContext`
- If `user` is null, React Router's `<Navigate>` sends to `/login`
- While waiting for `/auth/me` to respond, a spinner is shown (prevents flicker)

### Real-Time (Socket.io)
- `socket.emit("join_room", sessionId)` → user enters a room
- `socket.emit("send_message", {...})` → broadcast message to all room members
- `io.to(sessionId).emit(...)` → server sends only to users in that room
- `io.emit("active_rooms_update", ...)` → broadcast participant counts globally
- On disconnect, the user is automatically removed from the room

### State Management
- **Auth state**: React Context (`AuthContext.jsx`) — available app-wide via `useAuth()`
- **Schedule**: `localStorage` — persists across page refreshes
- **Chat/participants**: React `useState` hooks updated via Socket.io events

---

## Submission Checklist

- [ ] `node_modules/` is NOT included (add to `.gitignore`)
- [ ] `.env` is NOT included (only `.env.example`)
- [ ] Both `frontend/` and `backend/` source code are included
- [ ] This README is included with setup instructions
- [ ] App runs correctly with `npm run dev` in both folders

---

## Troubleshooting

**"Unauthorized" error on socket connection**
→ Make sure you're logged in before opening a live session page.
→ Ensure `withCredentials: true` is set on the frontend socket connection.

**LinkedIn callback fails**
→ Double-check the redirect URL in your LinkedIn Developer App matches exactly: `http://localhost:5000/auth/linkedin/callback`
→ Ensure you've requested "Sign In with LinkedIn using OpenID Connect" product access.

**CORS error in browser console**
→ Make sure `FRONTEND_URL=http://localhost:5173` in your `.env`
→ Ensure both servers are running (backend on 5000, frontend on 5173)

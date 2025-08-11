# Note Bank Frontend (React + Vite + Tailwind)

Modern React frontend for the Note Bank platform. Implements authentication, note browsing/upload, public and user note requests, and real-time notifications via WebSockets.

## Features
- Authentication (JWT) with refresh handling
- Browse, search, and filter notes
- Upload new notes (pending admin approval)
- Manage uploaded notes (edit or delete your own notes)
- Public note requests (view for all; fulfill flow)
- My note requests (create + list)
- Bookmarks, likes, ratings
- Contributors leaderboard
- Real-time notifications (WebSockets):
  - Public note requests: broadcast to all users
  - Note approved: sent to uploader only
  - Comment / Rating: sent to note owner only

## Tech Stack
- React 18, React Router
- Vite (dev/build)
- Tailwind CSS
- Axios and custom fetch wrapper
- React Toastify

## Getting Started

### Prerequisites
- Node.js 18+
- Running backend (see backend README)

### Install
```bash
npm install
```

### Environment Variables
Create `.env` at `note-bank-frontend/`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```
- `VITE_API_BASE_URL`: HTTP base for REST calls
- `VITE_WS_BASE_URL`: WS base for notifications

### Scripts
```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
```

## Project Structure (key paths)
```
src/
  api/
    apiService/
      axiosInstance.js           # axios w/ JWT refresh
      requestNoteService.js      # /api/requests/my-note-requests/
      publicNoteRequestService.js# /api/public-note-requests/
  components/
    layout/Navbar.jsx            # notifications dropdown
  context/
    AuthContext.jsx              # auth + WS notifications
    useAuth.js                   # hook facade
  utils/
    fetchWrapper.js              # lightweight fetch helper
```

## Routing (high level)
- `/` Home (request note section included for authenticated users)
- `/notes` Browse notes
- `/upload-note` Upload note
- `/note-requests` Public note requests
- `/my-notes` User’s uploaded notes
- `/contributors` Leaderboard
- `/profile` Profile
- Auth routes: `/login`, `/register`, password reset flow

## API Integration
- REST base: `${VITE_API_BASE_URL}`
- My Note Requests (create/list): `POST/GET /api/requests/my-note-requests/`
  - Legacy paths are also supported in backend for compatibility
- Public Note Requests (list/fulfill):
  - `GET /api/public-note-requests/?status=PENDING`
  - `POST /api/public-note-requests/{id}/fulfill/`
- Password reset confirm uses URL params and encodes/decodes uid/token safely

## Notifications (WebSockets)
- WS URL: `${VITE_WS_BASE_URL}/ws/notifications/`
- AuthContext opens a WS connection when a JWT token is present
- The client accepts two kinds of messages:
  - Global broadcasts (e.g., public note requests)
  - User-targeted messages containing `recipient_user_id`; the client filters so only intended users see them
- Navbar bell shows unread count and a dropdown. “Clear all” is available.

## Troubleshooting
- WebSocket fails to connect
  - Ensure backend runs as ASGI (daphne/uvicorn) with Channels enabled
  - For multi-process, configure Redis channel layer on the backend
  - Verify `VITE_WS_BASE_URL` is correct
- Seeing 404 for public note requests
  - Correct endpoint is `/api/public-note-requests/` (not under `/api/notes/`)
- Seeing 405/404 for my note requests
  - Frontend uses `/api/requests/my-note-requests/`; backend also exposes legacy paths for compatibility
- Password reset returns 400/invalid token
  - Ensure frontend encodes `uidb64`/`token`, backend decodes/validates (supports GET validate + POST confirm)
- Infinite render / Maximum update depth
  - Fixed by removing `user` from WS connect dependencies and using a ref for filtering

## Build & Deployment Notes
- Configure `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` per environment
- Serve the built assets with any static file server / SPA hosting

## License
MIT

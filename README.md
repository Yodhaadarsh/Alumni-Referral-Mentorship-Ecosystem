# Alumni Referral & Mentorship Ecosystem (PT396): full project

React (Vite) + Node/Express + MongoDB + Socket.io. Firebase notifications and Google Meet links are optional add-ons.

## Run it (two terminals, or double-click the two .bat files on Windows)

    # Terminal 1: backend  (http://localhost:5000)
    cd server
    npm install
    npm run dev

    # Terminal 2: frontend (http://localhost:5173)
    cd client
    npm install
    npm run dev

Open http://localhost:5173. Keep both terminals open.

## Database: nothing to install
`server/.env` ships with `MONGO_URI=` empty. In that case the server starts its own MongoDB and keeps the data in `server/data`,
so accounts, requests, referrals and chats survive restarts. The very first start downloads the MongoDB program once
(a few minutes, needs internet). Demo data is added automatically the first time.

To use your own MongoDB instead, put its address in `server/.env`:

    MONGO_URI=mongodb://127.0.0.1:27017/alumni_ecosystem          # local MongoDB
    MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/alumni_ecosystem   # Atlas

Demo data is added when the database has no users. `npm run seed` does the same for your own database.
Set `SEED_DEMO=false` in `.env` to turn demo data off. To start fresh with the built-in database, stop the server and delete `server/data`.

## Demo logins
| Role | Email | Password |
|---|---|---|
| Student | student@demo.com | demo123 |
| Alumni | aarav@demo.com (also nisha@, rohit@, fatima@, siddharth@, prerna@, kunal@, megha@, aditya@) | demo123 |
| Admin | admin@demo.com | admin123 |

## What is real
- Accounts, JWT login, roles, hashed passwords (bcrypt)
- Skill / interest / company matching, alumni search
- Mentorship requests, accept and schedule, referrals and applicants
- Real-time chat (Socket.io) with history saved in MongoDB
- Public landing page that reads alumni and openings from the database (shows sample data only while the database has no alumni)
- Admin overview and user management

## Optional integrations (work without them; features just stay off)
- **Google Meet links:** enable the Calendar API in Google Cloud, create an OAuth client, get a refresh token for the organiser account, then set
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` in `server/.env`. Without them, accepting a request works but no Meet link is created.
- **Push notifications:** create a Firebase project with Cloud Messaging. Put the service-account JSON on one line in `FIREBASE_SERVICE_ACCOUNT`
  (server `.env`), and the web config values in `client/.env` (see `client/.env.example`) and `client/public/firebase-messaging-sw.js`.

## Troubleshooting
- **"Cannot reach the server":** the backend is not running. Start Terminal 1 and wait for `Server running on 5000`.
- **Server says `Database error`:** your `MONGO_URI` is wrong or that MongoDB is not running. Empty it to use the built-in database.
- **Port already in use:** close old terminals (`taskkill /F /IM node.exe`) and start again.
- **Browser blocked by CORS:** set `CLIENT_URL` in `server/.env` to the exact address in your browser bar. Any localhost port is allowed by default.

## API overview
POST /api/auth/register | login, GET/PUT /api/auth/me · GET /api/public/overview (no login)
GET /api/alumni?q= · GET /api/alumni/match · POST /api/requests · GET /api/requests/mine · PATCH /api/requests/:id/accept|reject
GET|POST /api/referrals · POST /api/referrals/:id/apply · PATCH /api/referrals/:id/applicants/:studentId
GET /api/chat/:room (+ Socket.io events join, message) · GET /api/admin/stats|users, DELETE /api/admin/users/:id (admin only)

# Chat-Box

A lightweight real-time chat application with JWT authentication, socket-based messaging (Socket.io), and simple persistent storage for messages. Built to be easy to deploy and extend for features like private rooms and user panels.

## Key Features
- Real-time messaging with Socket.io
- JWT-based auth for secure socket and HTTP requests
- Message persistence (messages saved in database)
- Room support (public by default; easy to extend)
- Small, clear frontend and backend separation

## Tech Stack
- Node.js + Express
- Socket.io for real-time events
- MySQL (or compatible) for message persistence
- Vanilla HTML/CSS/JS frontend (simple and easy to modify)

## Quick Start (Development)
1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in project root with the following variables:

```
SECRET_KEY=your_jwt_secret
DB_HOST=127.0.0.1
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=your_db_name
PORT=3000
```

3. Ensure the database exists and create the `messages` table (example):

```sql
CREATE TABLE messages (
	id VARCHAR(36) PRIMARY KEY,
	sender_id VARCHAR(36) NOT NULL,
	username VARCHAR(100) NOT NULL,
	room_id VARCHAR(100) DEFAULT 'public',
	message TEXT NOT NULL,
	created_at VARCHAR(50)
);

-- users table should contain at least id, username, password(hash)
```

4. Run the server (dev):

```bash
node server.js
# or with nodemon (if installed):
nodemon server.js
```

Open the frontend pages in the `frontend/HTML` folder (or navigate to `http://localhost:3000` if served).

## Backend API (important endpoints)
- POST `/signup` — body: `{ username, password, confirmPassword }` — returns `{ success, token }` on success
- POST `/login` — body: `{ username, password }` — returns `{ success, token }`
- GET `/api/fetch/message?roomId=public` — requires authentication via cookie or `Authorization: Bearer <token>`; returns `{ success, messages, currentUser }`

Note: The server attaches `currentUser` to the messages response so the frontend can determine which stored messages belong to the signed-in user.

## Socket Events
- Client -> Server:
	- `joinRoom` { token, roomId } — authenticate and join a room
	- `chatMessage` { message } — send a message to the current room

- Server -> Client:
	- `joinRoomSuccess` { username, roomId }
	- `message` { username, message, timestamp, userId }
	- `messageError` { error }

Payload notes: messages from the server include `userId` which the frontend compares to `currentUser.id` to decide whether to render a message as `self` (right side) or received (left side).

## Database Notes
- `messages` table should include: `id`, `sender_id`, `username`, `room_id`, `message`, `created_at`.
- `sender_id` is important: it uniquely links the message to the user (better than username alone).

## Deployment & Production Notes
- Use a process manager (pm2 or systemd) and set environment variables in your host environment.
- Use HTTPS and a strong `SECRET_KEY` for JWTs.
- Consider rotating tokens, adding refresh tokens, and rate-limiting message endpoints for hardening.

## Extending the Project
- Private rooms, message editing/deleting, and multi-tenant rooms can be added with minimal changes:
	- backend: store room metadata and access control
	- frontend: route to `/room/:id` and call `joinRoom` with the roomId

## Where to look in this repo

---

If you want, we can add a small Dockerfile, CI steps, or a brief deployment guide next.

## Frontend Overview

The frontend is intentionally simple and focused on usability. It uses plain HTML, CSS, and minimal vanilla JavaScript so the UI is easy to read, modify, and extend even for developers who are not specialists in modern frontend frameworks. Key points:

- Simple pages: login, signup, main chat, user panel — each is a single HTML file under `frontend/HTML`.
- Lightweight JS: small modules in `frontend/js` handle socket events, form submissions and DOM updates with clear, commented code.
- Easy theming: styles are separated in `frontend/CSS` so look-and-feel can be updated quickly.

This design keeps the barrier to contribution low, reduces build complexity (no bundlers required), and makes the app fast to load and iterate on.

## Why this project is valuable

This project balances clarity, practicality, and extensibility — ideal for demos, early-stage products, or hiring portfolios. Highlights:

- Straightforward architecture: clear separation of frontend and backend, making onboarding fast for new developers.
- Real-time functionality: Socket.io integration demonstrates ability to build interactive, low-latency features.
- Production-ready basics: JWT auth, persistent messages, and simple room support provide a solid foundation to scale from.
- Easy to customize: minimal dependencies and readable code mean features (private rooms, moderation, file sharing) can be added quickly.

Employers and reviewers can run the app locally within minutes and immediately see core product behavior: user auth, persistent chat history, and live messaging.

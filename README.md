---

````markdown
# 🧠 AI Chat Server

A full-stack real-time AI assistant backend built with:

- ⚡ Express + REST API
- 🔌 Socket.IO for real-time communication
- 🔐 JWT Authentication
- 🧠 OpenAI (or custom AI model)
- 📚 Pinecone Vector DB
- 💾 MongoDB with Mongoose
- 🚦 Redis-backed rate limiting
- 🛡️ Security & performance middleware

---

## 📦 Tech Stack

| Layer         | Technology               |
|---------------|---------------------------|
| API Server     | Express.js               |
| Real-time Comm | Socket.IO                |
| Database       | MongoDB + Mongoose       |
| Vector Store   | Pinecone (or compatible) |
| AI Provider    | OpenAI / Custom Model    |
| Rate Limiting  | Redis + ioredis          |
| Auth           | JWT + Cookies            |
| Security       | Helmet, XSS-Clean, CORS  |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ai-chat-server.git
cd ai-chat-server
````

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root:

```env
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-chat

# JWT
JWT_SECRET=your_jwt_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI / AI Provider
GEMINI_API_KEY=KEY

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENV=your_pinecone_env
PINECONE_INDEX_NAME=your_index_name
```

---

### 4. Start the server

```bash
npm start
```

Server will run at:
👉 `http://localhost:3000`

---

## 📡 REST API Endpoints

### 🔐 Auth (`/api/auth`)

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| POST   | `/register` | Register a user |
| POST   | `/login`    | Log in a user   |

On success:

* Returns JWT token in an **HttpOnly cookie**

---

### 💬 Chat (`/api/chat`)

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| POST   | `/create` | Create a chat session |

**Request:**

```json
{
  "title": "Chat with AI"
}
```

**Response:**

```json
{
  "_id": "chat_id_generated",
  "title": "Chat with AI",
  "user": "user_id"
}
```

You will use `chat_id` in your Socket.IO communication.

---

## ⚡ Socket.IO Events

After login, connect via Socket.IO:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true
});
```

---

### 📩 `ai-msg` — Send prompt to AI

```js
socket.emit("ai-msg", {
  chat: "chat_id_here", 
  content: "What's the theory of relativity?"
});
```

---

### 📨 `ai-msg` — Receive AI response

```js
socket.on("ai-msg", (response) => {
  console.log("AI:", response);
});
```

**Example Response:**

```json
"Einstein's theory of relativity explains how time and space are linked..."
```

---

### 🚫 `rate-limit` — Rate limiting warning

If user exceeds limit (e.g. 5 messages per 10 seconds):

```js
socket.on("rate-limit", ({ message }) => {
  alert("Rate limited: " + message);
});
```

---

### ❌ `error` — General errors

```js
socket.on("error", ({ message }) => {
  console.error("Server error:", message);
});
```

---

## 🧱 Folder Structure

```
src/
├── app.js                  # Express config
├── server.js               # Entry point
├── db/                     # MongoDB connection
├── config/redis.js         # Redis client
├── models/                 # Mongoose schemas
├── routes/                 # REST API routes
├── services/               # AI + Vector services
├── sockets/                # Socket.IO handlers
├── middlewares/            # Auth, rate limiting, error
```

---

## 🛡️ Security & Middleware

* `helmet` — secure headers
* `cors` — cross-origin support
* `express-mongo-sanitize` — prevent NoSQL injection
* `xss-clean` — sanitize input from XSS
* `compression` — gzip compression
* `cookie-parser` — parse cookies
* `rateLimitMiddleware` — Redis-based rate limiting

---

## 🔒 Rate Limiting (Redis)

Socket + REST API requests are protected by Redis-based middleware.

**Example rule**:
`Max 5 requests per 10 seconds per user`

---

## ✅ .gitignore

Make sure you have this in your `.gitignore`:

```gitignore
# Node modules
node_modules/

# Environment
.env
.env.*.local

# Logs
*.log
logs/

# OS & Editor
.DS_Store
.idea/
.vscode/

# Build
dist/
build/

# Temp
*.tmp
*.temp
```

---

## 📖 License

MIT — use, modify, and share freely.

---

## 🙋 Need Help?

Open an issue or reach out to the maintainer for support.

```

---
- A frontend example (React/Vanilla) to consume this setup
```
---

# AffordMed Campus Hiring Evaluation — Frontend Track

**Name:** Srivarshan  
**Roll No:** RA2311026010762  
**Email:** srivarshansridhar5@gmail.com  
**GitHub:** https://github.com/SriVarshan2/RA2311026010762

---

## Project Structure

```
RA2311026010762/
├── question1/          # React Frontend (Port 3000)
├── question2/          # Express Backend (Port 5000)
├── Notification_System_Design.md
└── README.md
```

---

## Question 1 — React Frontend with Logging Middleware

### What it does
A React app running on `http://localhost:3000` that sends structured logs to the backend proxy.

### How to run
```bash
cd question1
npm install
npm start
```

### Key Implementation
- All log calls go through `http://localhost:5000/proxy/log` to avoid CORS issues
- Logs include: email, rollNo, accessCode, stack, level, package, message
- Auto-sends a log on page load
- Supports log levels: info, debug, warn, error

---

## Question 2 — Express Backend with Logging Middleware

### What it does
An Express server running on `http://localhost:5000` that:
- Authenticates with the AffordMed auth API automatically
- Caches the token for 55 minutes
- Auto-refreshes the token on expiry (401 retry logic)
- Proxies log requests from the frontend to avoid CORS

### How to run
```bash
cd question2
npm install
node index.js
```

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/log` | POST | Direct backend logging |
| `/proxy/log` | POST | CORS proxy for frontend logging |
| `/health` | GET | Health check |

### Auth API Format
```json
{
  "email": "srivarshansridhar5@gmail.com",
  "name": "Srivarshan",
  "rollNo": "ra2311026010762",
  "accessCode": "QkbpxH",
  "clientID": "c5ad8651-d6f7-40e0-ad72-4d327316a49e",
  "clientSecret": "MGhKHDvqsaJGGPYY"
}
```

### Log API Format
```json
{
  "email": "srivarshansridhar5@gmail.com",
  "rollNo": "ra2311026010762",
  "accessCode": "QkbpxH",
  "stack": "backend",
  "level": "info",
  "package": "express-app",
  "message": "Log message here"
}
```

### Why CORS Proxy?
The browser blocks direct calls to the log API due to CORS restrictions. The frontend calls the backend proxy (`localhost:5000/proxy/log`) instead, which forwards the request server-side — no CORS issues, no token management in the frontend.

---

## Stage 1 — Priority Inbox (Notification System)

### What it does
Fetches notifications from the AffordMed Notification API and returns the top 10 most important ones based on priority and recency.

### How to run
```bash
cd question1
AUTH_TOKEN="your_token_here" node priority_inbox.js
```

### Priority Logic
| Type | Weight |
|------|--------|
| Placement | 3 (highest) |
| Result | 2 |
| Event | 1 (lowest) |

Notifications are sorted by:
1. **Type weight** — Placement > Result > Event
2. **Recency** — Newer notifications rank higher when type is equal

### Example Output
```
===== TOP 10 PRIORITY NOTIFICATIONS =====

#1
  Type:      Placement
  Message:   CSX Corporation hiring
  Timestamp: 2026-04-22 17:51:18

#2
  Type:      Result
  Message:   mid-sem
  Timestamp: 2026-04-22 17:51:30
...
```

See `Notification_System_Design.md` for full design explanation.

---

## How to Run Everything Together

**Terminal 1 — Start Backend:**
```bash
cd question2
node index.js
```

**Terminal 2 — Start Frontend:**
```bash
cd question1
npm start
```

Open `http://localhost:3000` — the app will automatically send a log on load. Click the buttons to send more logs at different levels.

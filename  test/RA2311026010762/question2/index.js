const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Credentials
const CLIENT_ID = "c5ad8651-d6f7-40e0-ad72-4d327316a49e";
const CLIENT_SECRET = "MGhKHDvqsaJGGPYY";
const AUTH_API = "http://20.207.122.201/evaluation-service/auth";
const LOG_API = "http://20.207.122.201/evaluation-service/logs";

// Token cache
let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  console.log("[auth] Fetching fresh token...");
  const res = await axios.post(AUTH_API, {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });

  const token = res.data.token || res.data.access_token || res.data.accessToken;
  if (!token) throw new Error("Auth response missing token: " + JSON.stringify(res.data));

  cachedToken = token;
  tokenExpiry = Date.now() + 55 * 60 * 1000;
  console.log("[auth] Token refreshed ✅");
  return cachedToken;
}

async function sendLog(logData, retried = false) {
  const token = await getToken();
  try {
    const res = await axios.post(LOG_API, logData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 && !retried) {
      console.warn("[auth] 401 — forcing token refresh and retrying...");
      cachedToken = null;
      return sendLog(logData, true);
    }
    throw err;
  }
}

app.post("/log", async (req, res) => {
  try {
    const result = await sendLog(req.body);
    res.json({ success: true, result });
  } catch (err) {
    console.error("[/log] Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.post("/proxy/log", async (req, res) => {
  try {
    const result = await sendLog(req.body);
    res.json({ success: true, result });
  } catch (err) {
    console.error("[/proxy/log] Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  getToken().catch((e) => console.error("[startup] Token fetch failed:", e.message));
});
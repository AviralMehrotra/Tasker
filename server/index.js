import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import morgan from "morgan";
import dbConnection from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";
import { protectRoute, isAdminRoute } from "./middlewares/authMiddleware.js";
import sanitizeNoSql from "./middlewares/sanitizeMiddleware.js";
import routes from "./routes/index.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 8800;

const app = express();

// 1. HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. CORS Whitelist
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "https://tasker-tm.netlify.app",
      "https://tasker-pm.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body parsers with payload limits (DoS mitigation)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// 4. NoSQL injection sanitizer
app.use(sanitizeNoSql);

app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// 5. Rate Limiting (Brute force & DDoS protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Rate limit exceeded. Please try again later.",
  },
});
app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

// 6. Application Routes
app.use("/api", routes);

// 7. Structured Observability Health Check
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    status: "ok",
    database: dbStatusMap[dbState] || "unknown",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Guarded internal debug endpoint
app.get("/debug/notices", protectRoute, isAdminRoute, async (req, res) => {
  try {
    const Notice = (await import("./models/notice.js")).default;
    const all = await Notice.find({}).populate("task", "title").lean();
    res.json({ count: all.length, notices: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => {
  res.send("Tasker API is running securely.");
});

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

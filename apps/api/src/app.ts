/**
 * Express application configuration.
 *
 * Middleware order matters — each layer is applied in sequence:
 *   1. Rate limiting (DoS protection)
 *   2. Security headers (Helmet + X-Powered-By removal)
 *   3. Response compression
 *   4. Structured request logging
 *   5. CORS enforcement
 *   6. Body parsing with size limits
 *   7. Application routes
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes/index";
import { logger } from "./lib/logger";
import hpp from "hpp";

const app = express();

// ---------------------------------------------------------------------------
// 1. Rate limiting — prevent brute-force / DoS attacks
// ---------------------------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,      // Disable `X-RateLimit-*` legacy headers
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use(limiter);

// ---------------------------------------------------------------------------
// 2. Security hardening
// ---------------------------------------------------------------------------
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://world-cup-planner-api.onrender.com",
          "https://world-cup-planner-jade.vercel.app",
        ],
      },
    },
    hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
  }),
);

// ---------------------------------------------------------------------------
// 3. Compression — gzip / brotli responses
// ---------------------------------------------------------------------------
app.use(compression());

// ---------------------------------------------------------------------------
// 4. Structured request logging (pino)
// ---------------------------------------------------------------------------
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: string }) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res: ServerResponse) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ---------------------------------------------------------------------------
// 5. CORS — explicit origin allow-list
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS: readonly string[] = [
  "http://localhost:5173",
  "https://world-cup-planner-jade.vercel.app",
] as const;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin "${origin}" not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);

// ---------------------------------------------------------------------------
// 6. Body parsing with payload size limits (DoS prevention)
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ---------------------------------------------------------------------------
// 7. Application routes
// ---------------------------------------------------------------------------
app.use("/api", router);

export default app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");
const { notFoundHandler, errorHandler } = require("./errors");
const path = require("path");
// const upload = require("./middleware/upload.middleware.js");

const { authRoutes } = require("./auth");
const { authenticate, authorize } = require("./middleware/");
const ticketRoutes = require("./ticket/routes");

const app = express();

// ---------------- Pre-route Middleware ----------------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser(config.cookie.secret));
app.use(express.json());

// ---------------- Routes ----------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

app.use("/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

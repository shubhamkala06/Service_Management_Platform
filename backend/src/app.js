const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");
const { notFoundHandler, errorHandler } = require("./errors");

const userRoutes = require("./user/routes");
const authRoutes = require("./auth/routes");
const ticketRoutes = require("./ticket/routes");
const approvalRoutes = require("./ticket/approval/routes");

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

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/approvals", approvalRoutes);

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

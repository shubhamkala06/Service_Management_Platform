const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");
const {
  notFoundHandler,
  errorHandler,
} = require("./errors");

const {authRoutes} = require("./auth");
const {requireAuth, requireRoles} = require("./middleware/");


const app = express();

// ---------------- Pre-route Middleware ----------------
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }));
app.use(cookieParser(config.cookie.secret));
app.use(express.json());

// ---------------- Routes ----------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});


app.get("/api/me", requireAuth, (req, res) => {
    res.json(req.user);
});

app.use("/auth",authRoutes);

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

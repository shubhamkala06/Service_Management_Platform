const express = require("express");
const cookieParser = require("cookie-parser");

const config = require("./config/env");
const {
  notFoundHandler,
  errorHandler,
} = require("./errors");

const {authRoutes} = require("./auth");
const {requireAuth} = require("./middleware/");


const app = express();

// ---------------- Pre-route Middleware ----------------
app.use(cookieParser(config.cookie.secret));
app.use(express.json());

// ---------------- Routes ----------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/me",requireAuth,(req,res)=>{
  res.json(req.user);
})

app.use("/auth",authRoutes);

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

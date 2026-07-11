const express = require("express");

const {
  notFoundHandler,
  errorHandler,
} = require("./errors");

const app = express();

// ---------------- Pre-route Middleware ----------------

app.use(express.json());

// ---------------- Routes ----------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

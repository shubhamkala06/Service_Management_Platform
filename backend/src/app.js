const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");

const app = express();

// ---------------- Middleware ----------------

// Parse incoming JSON requests
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Add common security headers
app.use(helmet());

// Log incoming requests
app.use(morgan("dev"));

// ---------------- Routes ----------------

app.use("/api/health", healthRoutes);

module.exports = app;

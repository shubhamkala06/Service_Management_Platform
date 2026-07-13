const express = require("express");
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
app.use(cookieParser(config.cookie.secret));
app.use(express.json());

// ---------------- Routes ----------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get(
    "/employee",
    requireAuth,
    requireRoles("Employee"),
    (req, res) => {
        res.json({
            message: "Employee endpoint"
        });
    }
);

app.get(
    "/manager",
    requireAuth,
    requireRoles("Manager"),
    (req, res) => {
        res.json({
            message: "Manager endpoint"
        });
    }
);

app.get(
    "/sysadmin",
    requireAuth,
    requireRoles("System Administrator"),
    (req, res) => {
        res.json({
            message: "System Administrator endpoint"
        });
    }
);

app.get("/me",requireAuth,(req,res)=>{
  res.json(req.user);
})

app.use("/auth",authRoutes);

// ---------------- Post-route Middleware ----------------

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

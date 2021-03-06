require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const dataRoute = require("./routes/data.route");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
} = require("./controllers/auth.controller");

const dbConfig = require("./database/db");
const createError = require("http-errors");

//error handeler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((error) => {
    console.log("Database could not connected: " + error);
  });

// Setting up port with express js
const employeeRoute = require("../backend/routes/employee.route.js");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// app.use("static", path.join(__dirname, "./index.html"));
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/login", (req, res) => {
  res.send("login");
});
app.get("/logout", (req, res) => {
  res.send("logout");
});
app.get("/data", dataRoute);

app.use("/api", employeeRoute);
app.post("/api/users/register", registerUser);
app.post("/api/users/login", loginUser);
app.get("/api/users/auth", auth, getUserDetails);
app.get("/api/users/logout", auth, logoutUser);
app.use((err, req, res, next) => {
  createError(500, err);
});

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});

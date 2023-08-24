
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { join } = require("path");
const db = require("../models");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(","),
      // "http://localhost:3000"
    ],
  })
);

app.use(express.json());
// db.sequelize.sync({alter: true});

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

const {
  userRouter,
  profileRouter,
  productRouter,
  cartRouter,
  reportRouter,
} = require("./routes");

app.use("/auth", userRouter);
app.use("/profile", profileRouter);
app.use("/product", productRouter);
app.use("/transaction", cartRouter);
app.use("/report", reportRouter);
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use("/api/public", express.static(path.resolve(__dirname,"../public")));

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/public";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

const config = require("../config/config"); // Perbaikan path ke file config.js

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

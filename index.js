const express = require("express");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./connection");
const staticRouter = require("./routes/staticRoute");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const { checkForAuthenticatoin } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const app = express();

connectToMongoDB("mongodb://localhost:27017/sports-community-platform").then(
  () => {
    console.log("MongoDB connected.");
  }
);

app.use(express.json());

app.use(cookieParser());

app.use("/", staticRouter);
app.use("/user", userRouter);

app.use(checkForAuthenticatoin);
app.use("/event", eventRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});

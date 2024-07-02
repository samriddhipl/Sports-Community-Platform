const express = require("express");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./connection");
const staticRouter = require("./routes/staticRoute");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const { checkForAuthentication } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const leaderboardRouter = require("./routes/leaderboard");
const searchRouter = require("./routes/search");

const app = express();

connectToMongoDB("mongodb://localhost:27017/sports-community-platform").then(
  () => {
    console.log("MongoDB connected.");
  }
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", staticRouter);
app.use("/user", userRouter);

app.use(checkForAuthentication);
app.use("/event", eventRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/search", searchRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});

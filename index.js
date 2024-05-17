const express = require("express");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./connection");

const app = express();

connectToMongoDB("mongodb://localhost:27017/sports-community-platform").then(
  () => {
    console.log("MongoDB connected.");
  }
);

const PORT = 3000;
app.listen(3000, () => {
  console.log("Server is running!");
});

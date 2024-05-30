const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip_code: {
      type: Number,
      required: true,
    },
    categories: [{ type: String }], // Array of categories the user likes
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    level: {
      type: Number,
      default: 1,
    },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;

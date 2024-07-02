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
    latitude: {
      type: Number,
      default: 27.7172,
    },
    longitude: {
      type: Number,
      default: 85.324,
    },
    categories: [{ type: String }],
    followers: {
      type: Array,
    },
    following: {
      type: Array,
    },
    level: {
      type: Number,
      default: 1,
    },
    points: { type: Number, default: 1 },
    experience: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  username: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  points: {
    type: Number,
    default: 0,
  },
});

const Leaderboard = mongoose.model("leaderboard", leaderboardSchema);

module.exports = Leaderboard;

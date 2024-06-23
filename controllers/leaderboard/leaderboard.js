const Leaderboard = require("../../models/leaderboard");
const { getUser } = require("../../service/auth");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const getTokenFromHeader = async (req) => {
  const authHeader = await req.headers["authorization"];
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1]; // Split Bearer and token

  return token || null;
};

const getLeaderboard = async (req, res) => {
  try {
    const token = await getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    const users = await User.find().sort({ points: -1 });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.level,
      points: user.points,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getLeaderboard };

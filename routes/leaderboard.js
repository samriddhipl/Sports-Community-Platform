const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboard/leaderboard");
const router = express.Router();

router.get("/", getLeaderboard);

module.exports = router;

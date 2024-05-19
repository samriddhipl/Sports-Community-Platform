const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.end("Home Page");
});

module.exports = router;

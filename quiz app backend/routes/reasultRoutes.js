const express = require("express");
const router = express.Router();

const {
  saveResult,
  getResults,
  getLeaderboard,
} = require("../controllers/reasult.controller");

router.post("/save", saveResult);

router.get("/history/:userId", getResults);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
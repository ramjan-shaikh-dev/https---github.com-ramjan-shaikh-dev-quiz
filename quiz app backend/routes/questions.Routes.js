const express = require("express");
const router = express.Router();

const {
  getQuestions,
} = require("../controllers/questions.controller");

router.get("/", getQuestions);

module.exports = router;
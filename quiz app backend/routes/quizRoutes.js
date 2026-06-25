const express = require("express");
const router = express.Router();

const {
   submitQuiz, 
} = require("../controllers/quiz.controller");

router.post("/submit", submitQuiz);

module.exports = router;

const express = require("express");
const {
  createQuiz,
  getQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  toggleQuizStatus,
} = require("../controllers/quizController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Require auth for all quiz routes
router.use(requireAuth);

// Quiz routes
router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:quizId", getQuiz);
router.patch("/:quizId", updateQuiz);
router.delete("/:quizId", deleteQuiz);
router.patch("/:quizId/toggle-status", toggleQuizStatus);

module.exports = router;

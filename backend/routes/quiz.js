const express = require("express");
const {
  createQuiz,
  getQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  toggleQuizStatus,
  getPublicQuiz,
} = require("../controllers/quizController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public route - no auth required
router.get("/public/:quizId", getPublicQuiz);

// Require auth for all other quiz routes
router.use(requireAuth);

// Quiz routes
router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:quizId", getQuiz);
router.patch("/:quizId", updateQuiz);
router.delete("/:quizId", deleteQuiz);
router.patch("/:quizId/toggle-status", toggleQuizStatus);

module.exports = router;

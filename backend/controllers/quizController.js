const Quiz = require("../models/quizModel");
const QRCode = require("qrcode"); // You'll need to install this: npm install qrcode
const mongoose = require("mongoose");

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    console.log("Received quiz data:", JSON.stringify(req.body, null, 2));

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure options are properly formatted for Mongoose
    const formattedQuestions = questions.map((q) => ({
      ...q,
      // Ensure options is an array of strings, not an array of objects
      options: q.options.map((opt) => String(opt)),
    }));

    // Create new quiz
    const quiz = new Quiz({
      title,
      description,
      questions: formattedQuestions,
      creator: req.user._id,
    });

    // Generate QR code for the quiz
    const qrCodeData = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/quiz/${quiz.quizId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    quiz.qrCode = qrCodeImage;

    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a single quiz
const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ quizId }).populate(
      "creator",
      "name email"
    );

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all quizzes created by the user
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .select("-qrCode"); // Exclude qrCode field to reduce response size

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updates = req.body;

    // Check if the quiz exists and belongs to the user
    const quiz = await Quiz.findOne({
      quizId,
      creator: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or unauthorized" });
    }

    // Validate updates
    const allowedUpdates = ["title", "description", "questions", "isActive"];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    // Apply updates
    updateKeys.forEach((key) => (quiz[key] = updates[key]));

    // Regenerate QR code if quiz ID changed
    if (updates.quizId && updates.quizId !== quiz.quizId) {
      const qrCodeData = `${process.env.FRONTEND_URL}/quiz/${updates.quizId}`;
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      quiz.qrCode = qrCodeImage;
    }

    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if the quiz exists and belongs to the user
    const deletedQuiz = await Quiz.findOneAndDelete({
      quizId,
      creator: req.user._id,
    });

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found or unauthorized" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle quiz active status
const toggleQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      quizId,
      creator: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or unauthorized" });
    }

    quiz.isActive = !quiz.isActive;
    await quiz.save();

    res.status(200).json({
      message: `Quiz ${
        quiz.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: quiz.isActive,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  toggleQuizStatus,
};

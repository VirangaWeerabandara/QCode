const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number, // Index of correct option
    required: true,
  },
});

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    type: String, // URL to stored QR code image
  },
  questions: [questionSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Quiz Method
quizSchema.statics.createQuiz = async function (quizData) {
  try {
    const quiz = new this(quizData);
    await quiz.save();
    return quiz;
  } catch (error) {
    throw new Error(`Error creating quiz: ${error.message}`);
  }
};

// Delete Quiz Method
quizSchema.statics.deleteQuiz = async function (quizId) {
  try {
    const deletedQuiz = await this.findOneAndDelete({ quizId });
    if (!deletedQuiz) {
      throw new Error("Quiz not found");
    }
    return deletedQuiz;
  } catch (error) {
    throw new Error(`Error deleting quiz: ${error.message}`);
  }
};

// Edit Quiz Method
quizSchema.statics.editQuiz = async function (quizId, updates) {
  try {
    const quiz = await this.findOne({ quizId });
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Validate updates
    const allowedUpdates = ["title", "description", "questions", "isActive"];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidOperation) {
      throw new Error("Invalid updates");
    }

    // Apply updates
    updateKeys.forEach((key) => (quiz[key] = updates[key]));
    await quiz.save();
    return quiz;
  } catch (error) {
    throw new Error(`Error updating quiz: ${error.message}`);
  }
};

// Helper method to validate quiz data
quizSchema.methods.validateQuiz = function () {
  if (
    !this.title ||
    !this.creator ||
    !this.questions ||
    this.questions.length === 0
  ) {
    throw new Error("Missing required fields");
  }

  // Validate each question
  this.questions.forEach((question) => {
    if (!question.options || question.options.length < 2) {
      throw new Error("Questions must have at least 2 options");
    }
    if (question.correctAnswer >= question.options.length) {
      throw new Error("Invalid correct answer index");
    }
  });
};

module.export = mongoose.model("Quiz", quizSchema);

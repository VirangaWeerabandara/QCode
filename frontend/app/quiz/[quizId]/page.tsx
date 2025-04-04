"use client";

import { useState, useEffect } from "react";
import { quizApi, Quiz, Question } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function QuizAttemptPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showUserForm, setShowUserForm] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        // Fetch the quiz using the public endpoint
        const response = await fetch(
          `https://qcode.altero.dev/quiz/public/${quizId}`
        );

        if (!response.ok) {
          throw new Error("Quiz not found or not available");
        }

        const quizData = await response.json();

        if (!quizData.isActive) {
          throw new Error("This quiz is not currently active");
        }

        setQuiz(quizData);
        // Initialize answer array based on number of questions
        setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Copy all the handlers and rendering logic from your attempt-quiz/page.tsx file
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      return;
    }
    setShowUserForm(false);
    setQuizStarted(true);
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;

    // Calculate score
    let totalScore = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setQuizFinished(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lightkblue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Blueviolet"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightkblue p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red mb-4">Error</h1>
          <p className="text-charcoal mb-6">{error}</p>
          <Link
            href="/"
            className="block text-center bg-Blueviolet hover:bg-midnightblue text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (showUserForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightkblue p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-midnightblue mb-2">
            {quiz.title}
          </h1>
          <p className="text-charcoal mb-6">{quiz.description}</p>

          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-charcoal mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-grey500 rounded-md focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="userEmail"
                className="block text-sm font-medium text-charcoal mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-grey500 rounded-md focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-Blueviolet hover:bg-midnightblue text-white font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const totalPossibleScore = quiz.questions.reduce(
      (sum, q) => sum + q.points,
      0
    );
    const percentage = Math.round((score / totalPossibleScore) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightkblue p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-midnightblue mb-4">
            Quiz Completed!
          </h1>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-Blueviolet mb-2">
              {percentage}%
            </div>
            <p className="text-lg">
              Your Score: {score} out of {totalPossibleScore}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setQuizFinished(false);
              }}
              className="w-full bg-midnightblue hover:bg-Blueviolet text-white font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Review Answers
            </button>

            <Link
              href="/"
              className="block text-center bg-grey500 hover:bg-lightgray text-midnightblue font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="flex flex-col min-h-screen bg-lightkblue">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-midnightblue text-xl font-bold">
            QCode
          </Link>
          <div className="text-charcoal">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedAnswers[currentQuestionIndex] === idx
                    ? "border-Blueviolet bg-semiblueviolet"
                    : "border-grey500 hover:border-Blueviolet"
                }`}
                onClick={() => handleOptionSelect(idx)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                      selectedAnswers[currentQuestionIndex] === idx
                        ? "bg-Blueviolet text-white"
                        : "border border-grey500"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === idx && "✓"}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? "bg-grey500 cursor-not-allowed"
                  : "bg-midnightblue text-white hover:bg-Blueviolet"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-Blueviolet text-white rounded hover:bg-midnightblue"
            >
              {isLastQuestion ? "Finish Quiz" : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

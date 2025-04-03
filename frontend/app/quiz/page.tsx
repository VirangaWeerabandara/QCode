"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const [quizIdInput, setQuizIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizIdInput.trim()) {
      setError("Please enter a quiz ID");
      return;
    }
    router.push(`/quiz/${quizIdInput}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightkblue p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-midnightblue mb-4">
          Enter Quiz ID
        </h1>
        <p className="text-charcoal mb-6">
          Please enter the ID of the quiz you want to take.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="quizId"
              className="block text-sm font-medium text-charcoal mb-1"
            >
              Quiz ID
            </label>
            <input
              type="text"
              id="quizId"
              value={quizIdInput}
              onChange={(e) => setQuizIdInput(e.target.value)}
              className="w-full px-3 py-2 border border-grey500 rounded-md focus:outline-none focus:ring-2 focus:ring-Blueviolet"
              placeholder="Enter quiz ID"
            />
            {error && <p className="text-red text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-Blueviolet hover:bg-midnightblue text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            Start Quiz
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-Blueviolet hover:text-midnightblue transition-colors duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

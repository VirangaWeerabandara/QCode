"use client";

import React, { useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      type: "multiple-choice",
      options: ["", ""],
      correctAnswer: 0,
      points: 1,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionChange = (id: number, field: string, value: string | number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options.length < 6) {
          return { ...q, options: [...q.options, ""] };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options.length > 2) {
          const newOptions = [...q.options];
          newOptions.splice(optionIndex, 1);

          // Adjust correctAnswer if needed
          let newCorrectAnswer = q.correctAnswer;
          if (optionIndex === q.correctAnswer) {
            newCorrectAnswer = 0;
          } else if (optionIndex < q.correctAnswer) {
            newCorrectAnswer = q.correctAnswer - 1;
          }

          return {
            ...q,
            options: newOptions,
            correctAnswer: newCorrectAnswer,
          };
        }
        return q;
      })
    );
  };

  const addQuestion = () => {
    const newId = Math.max(0, ...questions.map((q) => q.id)) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        type: "multiple-choice",
        options: ["", ""],
        correctAnswer: 0,
        points: 1,
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submitting
    if (!quizTitle.trim()) {
      alert("Please add a quiz title");
      return;
    }

    // Check if all questions have content
    const incompleteQuestions = questions.filter((q) => !q.question.trim());
    if (incompleteQuestions.length > 0) {
      alert("Please fill in all question fields");
      return;
    }

    // Check if all options have content
    const incompleteOptions = questions.some((q) =>
      q.options.some((opt) => !opt.trim())
    );
    if (incompleteOptions) {
      alert("Please fill in all option fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // This would be an API call in a real application
      console.log("Submitting quiz:", {
        title: quizTitle,
        description: quizDescription,
        questions,
      });

      // Example API call:
      // const response = await fetch('/api/quizzes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title: quizTitle,
      //     description: quizDescription,
      //     questions
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Quiz created successfully!");

      // Reset form
      setQuizTitle("");
      setQuizDescription("");
      setQuestions([
        {
          id: 1,
          question: "",
          type: "multiple-choice",
          options: ["", ""],
          correctAnswer: 0,
          points: 1,
        },
      ]);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quiz-title"
          >
            Quiz Title
          </label>
          <input
            id="quiz-title"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter quiz title"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quiz-description"
          >
            Quiz Description (Optional)
          </label>
          <textarea
            id="quiz-description"
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter quiz description"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Questions</h2>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="mb-8 p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Question {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                  className={`p-1 rounded-full ${
                    questions.length === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-500 hover:bg-red-100"
                  }`}
                  title="Remove question"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.id,
                      "question",
                      e.target.value
                    )
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "type", e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="single-select">Single Select</option>
                </select>
              </div>

              {question.type === "true-false" ? (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Correct Answer
                  </label>
                  <div className="flex items-center">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 0}
                        onChange={() =>
                          handleQuestionChange(question.id, "correctAnswer", 0)
                        }
                        className="mr-2"
                      />
                      True
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 1}
                        onChange={() =>
                          handleQuestionChange(question.id, "correctAnswer", 1)
                        }
                        className="mr-2"
                      />
                      False
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Options
                  </label>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() =>
                          handleQuestionChange(
                            question.id,
                            "correctAnswer",
                            optionIndex
                          )
                        }
                        className="mr-3"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            question.id,
                            optionIndex,
                            e.target.value
                          )
                        }
                        className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => removeOption(question.id, optionIndex)}
                        disabled={question.options.length <= 2}
                        className={`ml-2 p-1 rounded-full ${
                          question.options.length <= 2
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:bg-red-100"
                        }`}
                        title="Remove option"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {question.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-1" />
                      Add Option
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={question.points}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.id,
                      "points",
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
          >
            <PlusCircleIcon className="h-5 w-5 mr-1" />
            Add Another Question
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}

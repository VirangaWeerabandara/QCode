"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { quizApi } from "@/utils/api";

export default function CreateQuiz() {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  type QuestionType = "multiple-choice" | "true-false" | "single-select";

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      type: "multiple-choice" as QuestionType,
      options: ["", ""],
      correctAnswer: 0,
      points: 1,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
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
        type: "multiple-choice" as QuestionType,
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
    setError(null);

    try {
      // Validate before submitting
      if (!quizTitle.trim()) {
        setError("Please add a quiz title");
        return;
      }

      // Log the questions for debugging (check console)
      console.log("Questions to submit:", questions);

      // More detailed validation with specific info about what's missing
      const emptyQuestions = questions
        .map((q, i) => (!q.question.trim() ? i + 1 : null))
        .filter(Boolean);

      if (emptyQuestions.length > 0) {
        setError(
          `Please fill question text for question(s) #${emptyQuestions.join(
            ", "
          )}`
        );
        return;
      }

      // Check if all options have content - with better error reporting
      let hasEmptyOptions = false;
      let firstEmptyOptionInfo = "";

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        for (let j = 0; j < q.options.length; j++) {
          if (q.type !== "true-false" && !q.options[j].trim()) {
            hasEmptyOptions = true;
            firstEmptyOptionInfo = `Question #${i + 1}, Option #${j + 1}`;
            break;
          }
        }
        if (hasEmptyOptions) break;
      }

      if (hasEmptyOptions) {
        setError(
          `Please fill in all option fields (${firstEmptyOptionInfo} is empty)`
        );
        return;
      }

      setIsSubmitting(true);

      // Prepare the quiz data for API with explicit type casting
      // Inside your handleSubmit function before sending the data
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        questions: questions.map(({ id, ...rest }) => {
          // Ensure type is one of the required values
          const questionType = rest.type as
            | "multiple-choice"
            | "true-false"
            | "single-select";

          return {
            question: rest.question.trim(),
            type: questionType,
            // Ensure options are strings
            options: rest.options.map((opt) => String(opt.trim())),
            correctAnswer: Number(rest.correctAnswer),
            points: Number(rest.points),
          };
        }),
      };

      console.log(
        "About to send quiz data:",
        JSON.stringify(quizData, null, 2)
      );

      // Send to API
      const result = await quizApi.createQuiz(quizData);
      console.log("API response:", result);

      // Show success and redirect
      alert("Quiz created successfully!");
      router.push("/dashboard/my-quizzes");
    } catch (err) {
      console.error("Error creating quiz:", err);

      // More detailed error message
      if (err instanceof Error) {
        setError(err.message);
        // Check if it's a validation error from our backend
        if (err.message.includes("required")) {
          setError(
            "Backend validation error: " +
              err.message +
              "\nPlease check that all required fields are filled."
          );
        }
      } else {
        setError("Failed to create quiz. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-midnightblue">
        Create New Quiz
      </h1>

      {error && (
        <div className="bg-red/10 border border-red text-red px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 border border-grey500/30"
      >
        <div className="mb-6">
          <label
            className="block text-midnightblue text-sm font-bold mb-2"
            htmlFor="quiz-title"
          >
            Quiz Title
          </label>
          <input
            id="quiz-title"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="shadow-sm border border-grey500/50 rounded w-full py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
            placeholder="Enter quiz title"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-midnightblue text-sm font-bold mb-2"
            htmlFor="quiz-description"
          >
            Quiz Description (Optional)
          </label>
          <textarea
            id="quiz-description"
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            className="shadow-sm border border-grey500/50 rounded w-full py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
            placeholder="Enter quiz description"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-midnightblue">
            Questions
          </h2>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="mb-8 p-4 border rounded-lg bg-lightkblue border-grey500/30"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-midnightblue">
                  Question {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                  className={`p-1 rounded-full ${
                    questions.length === 1
                      ? "text-lightgray cursor-not-allowed"
                      : "text-red hover:bg-red/10"
                  }`}
                  title="Remove question"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-midnightblue text-sm font-bold mb-2">
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
                  className="shadow-sm border border-grey500/50 rounded w-full py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-midnightblue text-sm font-bold mb-2">
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "type", e.target.value)
                  }
                  className="shadow-sm border border-grey500/50 rounded w-full py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="single-select">Single Select</option>
                </select>
              </div>

              {question.type === "true-false" ? (
                <div className="mb-4">
                  <label className="block text-midnightblue text-sm font-bold mb-2">
                    Correct Answer
                  </label>
                  <div className="flex items-center">
                    <label className="mr-4 text-midnightblue">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 0}
                        onChange={() =>
                          handleQuestionChange(question.id, "correctAnswer", 0)
                        }
                        className="mr-2 text-Blueviolet focus:ring-Blueviolet"
                      />
                      True
                    </label>
                    <label className="text-midnightblue">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 1}
                        onChange={() =>
                          handleQuestionChange(question.id, "correctAnswer", 1)
                        }
                        className="mr-2 text-Blueviolet focus:ring-Blueviolet"
                      />
                      False
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-midnightblue text-sm font-bold mb-2">
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
                        className="mr-3 text-Blueviolet focus:ring-Blueviolet"
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
                        className="shadow-sm border border-grey500/50 rounded flex-1 py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => removeOption(question.id, optionIndex)}
                        disabled={question.options.length <= 2}
                        className={`ml-2 p-1 rounded-full ${
                          question.options.length <= 2
                            ? "text-lightgray cursor-not-allowed"
                            : "text-red hover:bg-red/10"
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
                      className="mt-2 flex items-center text-Blueviolet hover:text-midnightblue transition duration-150"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-1" />
                      Add Option
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-midnightblue text-sm font-bold mb-2">
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
                  className="shadow-sm border border-grey500/50 rounded w-20 py-2 px-3 text-midnightblue leading-tight focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center text-Blueviolet hover:text-midnightblue transition duration-150 mb-6"
          >
            <PlusCircleIcon className="h-5 w-5 mr-1" />
            Add Another Question
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-grey500 hover:bg-grey500/80 text-midnightblue font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-Blueviolet mr-2 transition duration-150"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-Blueviolet hover:bg-midnightblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-Blueviolet transition duration-150"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}

// app/create-quiz/page.tsx
"use client"; // Mark this as a Client Component
import { useState } from "react";
import Link from "next/link";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, correctAnswer: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = correctAnswer;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quiz Title:", quizTitle);
    console.log("Questions:", questions);
    alert("Quiz created successfully!");
  };

  return (
    <div className="create-quiz-container">
      <div className="header-actions">
        <Link href="/">
          <button className="go-back-btn">← Go Back</button>
        </Link>
        <h1 className="page-title">Create a New Quiz</h1>
      </div>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label className="form-label">Quiz Title</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-group">
            <div className="question-header">
              <label className="form-label">Question {questionIndex + 1}</label>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(questionIndex)}
                className="delete-question-btn"
              >
                Delete Question
              </button>
            </div>
            <input
              type="text"
              value={question.question}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
              className="form-input"
              required
            />

            <label className="form-label">Options</label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-group">
                <span className="option-number">{optionIndex + 1}.</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(questionIndex, optionIndex, e.target.value)
                  }
                  className="form-input option-input"
                  required
                />
              </div>
            ))}

            <label className="form-label">Correct Answer</label>
            <select
              value={question.correctAnswer}
              onChange={(e) =>
                handleCorrectAnswerChange(questionIndex, parseInt(e.target.value))
              }
              className="form-select"
            >
              {question.options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={handleAddQuestion} className="add-question-btn">
            + Add Question
          </button>
          <button type="submit" className="submit-btn">
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function MyQuizzes() {
  // This would be fetched from the API in a real application
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      questionsCount: 10,
      participants: 32,
      date: "2023-12-15",
      active: true,
    },
    {
      id: 2,
      title: "React Hooks Quiz",
      questionsCount: 8,
      participants: 18,
      date: "2023-12-10",
      active: true,
    },
    {
      id: 3,
      title: "CSS Flexbox Challenge",
      questionsCount: 12,
      participants: 24,
      date: "2023-12-05",
      active: false,
    },
    {
      id: 4,
      title: "HTML Basics",
      questionsCount: 15,
      participants: 45,
      date: "2023-11-25",
      active: false,
    },
  ]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const toggleQuizStatus = (id: number) => {
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, active: !quiz.active } : quiz
      )
    );
  };

  type Quiz = {
    id: number;
    title: string;
    questionsCount: number;
    participants: number;
    date: string;
    active: boolean;
  };

  const confirmDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleting(true);
  };

  const deleteQuiz = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuiz.id));
      setIsDeleting(false);
      setSelectedQuiz(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setSelectedQuiz(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Quizzes</h1>
        <Link
          href="/dashboard/create-quiz"
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            You haven't created any quizzes yet.
          </p>
          <Link
            href="/dashboard/create-quiz"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quiz
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Questions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Participants
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {quiz.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {quiz.questionsCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {quiz.participants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(quiz.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        quiz.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {quiz.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Link
                        href={`/dashboard/preview-quiz/${quiz.id}`}
                        className="text-gray-500 hover:text-gray-700"
                        title="Preview Quiz"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/analytics/${quiz.id}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Analytics"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/edit-quiz/${quiz.id}`}
                        className="text-indigo-500 hover:text-indigo-700"
                        title="Edit Quiz"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => toggleQuizStatus(quiz.id)}
                        className={`${
                          quiz.active
                            ? "text-yellow-500 hover:text-yellow-700"
                            : "text-green-500 hover:text-green-700"
                        }`}
                        title={
                          quiz.active ? "Deactivate Quiz" : "Activate Quiz"
                        }
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(quiz)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Quiz"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Quiz
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{selectedQuiz?.title}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteQuiz}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

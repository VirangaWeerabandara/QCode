"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
  ShareIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { quizApi, Quiz } from "@/utils/api";


export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const quizzesData = await quizApi.getQuizzes();
      setQuizzes(quizzesData);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to load quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuizStatus = async (quizId: string) => {
    try {
      const result = await quizApi.toggleQuizStatus(quizId);

      // Update the local state to reflect the change
      setQuizzes(
        quizzes.map((quiz) =>
          quiz.quizId === quizId ? { ...quiz, isActive: result.isActive } : quiz
        )
      );
    } catch (err) {
      console.error("Error toggling quiz status:", err);
      alert("Failed to update quiz status. Please try again.");
    }
  };

  const confirmDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleting(true);
  };

  const deleteQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      await quizApi.deleteQuiz(selectedQuiz.quizId);
      setQuizzes(quizzes.filter((quiz) => quiz.quizId !== selectedQuiz.quizId));
      setIsDeleting(false);
      setSelectedQuiz(null);
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setSelectedQuiz(null);
  };

  const openShareModal = (quiz: Quiz) => {
    const baseUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/quiz/`
        : "https://qcode.altero.dev/quiz/";

    setShareUrl(`${baseUrl}${quiz.quizId}`);
    setSelectedQuiz(quiz);
    setIsSharing(true);
    setCopySuccess(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Blueviolet"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red p-8 bg-white rounded-lg shadow-md">
        <p>{error}</p>
        <button
          onClick={() => fetchQuizzes()}
          className="mt-4 px-4 py-2 bg-Blueviolet text-white rounded hover:bg-midnightblue"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-midnightblue">My Quizzes</h1>
        <Link
          href="/dashboard/create-quiz"
          className="flex items-center bg-Blueviolet hover:bg-midnightblue text-white font-bold py-2 px-4 rounded transition duration-150"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-grey500/30">
          <p className="text-lightgray mb-4">
            You have not created any quizzes yet.
          </p>
          <Link
            href="/dashboard/create-quiz"
            className="inline-flex items-center bg-Blueviolet hover:bg-midnightblue text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-grey500/30">
          <table className="min-w-full divide-y divide-grey500">
            <thead className="bg-lightkblue">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-midnightblue uppercase tracking-wider"
                >
                  Quiz
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-midnightblue uppercase tracking-wider"
                >
                  Questions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-midnightblue uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-midnightblue uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-midnightblue uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-grey500/30">
              {quizzes.map((quiz) => (
                <tr
                  key={quiz._id}
                  className="hover:bg-lightkblue transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-midnightblue">
                      {quiz.title}
                    </div>
                    <div className="text-sm text-lightgray">
                      {quiz.description && quiz.description.length > 50
                        ? `${quiz.description.substring(0, 50)}...`
                        : quiz.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-lightgray">
                      {quiz.questions.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-lightgray">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleQuizStatus(quiz.quizId)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        quiz.isActive ? "bg-Blueviolet" : "bg-grey500"
                      }`}
                    >
                      <span className="sr-only">Toggle active status</span>
                      <span
                        className={`${
                          quiz.isActive ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                    <span className="ml-2 text-xs text-lightgray">
                      {quiz.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => openShareModal(quiz)}
                        className="text-midnightblue hover:text-Blueviolet transition duration-150"
                        title="Share Quiz"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                      <Link
                        href={`/quiz/${quiz.quizId}`}
                        className="text-midnightblue hover:text-Blueviolet transition duration-150"
                        title="Preview Quiz"
                        target="_blank"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/analytics/${quiz.quizId}`}
                        className="text-midnightblue hover:text-Blueviolet transition duration-150"
                        title="View Analytics"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/edit-quiz/${quiz.quizId}`}
                        className="text-midnightblue hover:text-Blueviolet transition duration-150"
                        title="Edit Quiz"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(quiz)}
                        className="text-red hover:text-red/70 transition duration-150"
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
        <div className="fixed inset-0 bg-midnightblue bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-midnightblue mb-4">
                Delete Quiz
              </h3>
              <p className="text-sm text-lightgray mb-6">
                Are you sure you want to delete &quot;{selectedQuiz?.title}
                &quot;? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="bg-grey500 hover:bg-grey500/80 text-midnightblue font-bold py-2 px-4 rounded transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteQuiz}
                  className="bg-red hover:bg-red/80 text-white font-bold py-2 px-4 rounded transition duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {isSharing && (
        <div className="fixed inset-0 bg-midnightblue bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-midnightblue mb-4">
                Share Quiz: {selectedQuiz?.title}
              </h3>

              <div className="mb-4">
                <p className="text-sm text-lightgray mb-2">
                  Quiz ID: {selectedQuiz?.quizId}
                </p>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="p-2 flex-1 outline-none text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 text-white ${
                      copySuccess ? "bg-green-500" : "bg-Blueviolet"
                    }`}
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {selectedQuiz?.qrCode && (
                <div className="mt-4 mb-6">
                  <p className="text-sm text-lightgray mb-2">QR Code</p>
                  <div className="flex justify-center">
                    <img
                      src={selectedQuiz.qrCode}
                      alt="Quiz QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsSharing(false)}
                  className="bg-grey500 hover:bg-grey500/80 text-midnightblue font-bold py-2 px-4 rounded transition duration-150"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

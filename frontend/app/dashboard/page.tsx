"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { quizApi, Quiz } from "@/utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalParticipants: 0,
    recentParticipants: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const quizzes = await quizApi.getQuizzes();

        // Calculate stats
        const activeQuizzes = quizzes.filter((quiz) => quiz.isActive);

        // Set recent quizzes (top 3)
        setRecentQuizzes(quizzes.slice(0, 3));

        // Set stats
        setStats({
          totalQuizzes: quizzes.length,
          activeQuizzes: activeQuizzes.length,
          totalParticipants: 0, // You would need a separate API for this
          recentParticipants: 0, // You would need a separate API for this
        });
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

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
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-Blueviolet text-white rounded hover:bg-midnightblue"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-midnightblue">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-grey500/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-semiblueviolet mr-4">
              <DocumentTextIcon className="h-6 w-6 text-Blueviolet" />
            </div>
            <div>
              <p className="text-sm text-lightgray">Total Quizzes</p>
              <p className="text-xl font-semibold text-midnightblue">
                {stats.totalQuizzes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-grey500/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-semiblueviolet mr-4">
              <ClockIcon className="h-6 w-6 text-Blueviolet" />
            </div>
            <div>
              <p className="text-sm text-lightgray">Active Quizzes</p>
              <p className="text-xl font-semibold text-midnightblue">
                {stats.activeQuizzes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-grey500/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-semiblueviolet mr-4">
              <UsersIcon className="h-6 w-6 text-Blueviolet" />
            </div>
            <div>
              <p className="text-sm text-lightgray">Total Participants</p>
              <p className="text-xl font-semibold text-midnightblue">
                {stats.totalParticipants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-grey500/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-semiblueviolet mr-4">
              <UsersIcon className="h-6 w-6 text-Blueviolet" />
            </div>
            <div>
              <p className="text-sm text-lightgray">Recent Participants</p>
              <p className="text-xl font-semibold text-midnightblue">
                {stats.recentParticipants}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-grey500/30">
        <h2 className="text-lg font-semibold mb-4 text-midnightblue">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/create-quiz"
            className="flex items-center p-4 border border-grey500/50 rounded-lg hover:bg-semiblueviolet transition-colors duration-150"
          >
            <PlusCircleIcon className="h-6 w-6 text-Blueviolet mr-3" />
            <span className="text-midnightblue">Create New Quiz</span>
          </Link>
          <Link
            href="/dashboard/my-quizzes"
            className="flex items-center p-4 border border-grey500/50 rounded-lg hover:bg-semiblueviolet transition-colors duration-150"
          >
            <DocumentTextIcon className="h-6 w-6 text-Blueviolet mr-3" />
            <span className="text-midnightblue">Manage Quizzes</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center p-4 border border-grey500/50 rounded-lg hover:bg-semiblueviolet transition-colors duration-150"
          >
            <UsersIcon className="h-6 w-6 text-Blueviolet mr-3" />
            <span className="text-midnightblue">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-grey500/30">
        <div className="px-6 py-4 border-b border-Blueviolet/30">
          <h2 className="text-lg font-semibold text-midnightblue">
            Recent Quizzes
          </h2>
        </div>
        {recentQuizzes.length === 0 ? (
          <div className="p-6 text-center text-lightgray">
            <p>No quizzes found. Create your first quiz!</p>
          </div>
        ) : (
          <div className="divide-y divide-grey500/30">
            {recentQuizzes.map((quiz) => (
              <div key={quiz._id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-midnightblue">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-lightgray">
                      {quiz.questions.length} questions • Created on{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/my-quizzes/${quiz.quizId}`}
                      className="text-Blueviolet hover:text-midnightblue transition-colors duration-150"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 bg-lightkblue">
          <Link
            href="/dashboard/my-quizzes"
            className="text-Blueviolet hover:text-midnightblue transition-colors duration-150"
          >
            View All Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}

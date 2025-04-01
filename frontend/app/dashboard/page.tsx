"use client";

import React from "react";
import Link from "next/link";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  // This would be fetched from the API in a real application
  const stats = {
    totalQuizzes: 12,
    activeQuizzes: 3,
    totalParticipants: 145,
    recentParticipants: 28,
  };

  // Dummy recent quizzes data
  const recentQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      participants: 32,
      date: "2023-12-15",
    },
    { id: 2, title: "React Hooks Quiz", participants: 18, date: "2023-12-10" },
    {
      id: 3,
      title: "CSS Flexbox Challenge",
      participants: 24,
      date: "2023-12-05",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <p className="text-xl font-semibold">{stats.totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Quizzes</p>
              <p className="text-xl font-semibold">{stats.activeQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Participants</p>
              <p className="text-xl font-semibold">{stats.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <UsersIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recent Participants</p>
              <p className="text-xl font-semibold">
                {stats.recentParticipants}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/create-quiz"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <PlusCircleIcon className="h-6 w-6 text-blue-500 mr-3" />
            <span>Create New Quiz</span>
          </Link>
          <Link
            href="/dashboard/my-quizzes"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-500 mr-3" />
            <span>Manage Quizzes</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <UsersIcon className="h-6 w-6 text-purple-500 mr-3" />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Quizzes</h2>
        </div>
        <div className="divide-y">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">
                    {quiz.participants} participants • Created on{" "}
                    {new Date(quiz.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/dashboard/my-quizzes/${quiz.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <Link
            href="/dashboard/my-quizzes"
            className="text-blue-500 hover:text-blue-700"
          >
            View All Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    {
      name: "Create Quiz",
      path: "/dashboard/create-quiz",
      icon: PlusCircleIcon,
    },
    {
      name: "My Quizzes",
      path: "/dashboard/my-quizzes",
      icon: DocumentTextIcon,
    },
    { name: "Analytics", path: "/dashboard/analytics", icon: ChartBarIcon },
    { name: "Settings", path: "/dashboard/settings", icon: CogIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link href="/">
            <Image
              src="/assets/logo/logo1.png"
              alt="QCode"
              width={120}
              height={40}
              priority
              className="mx-auto"
            />
          </Link>
        </div>
        <div className="py-4">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="mb-1">
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 mx-2 rounded-lg ${
                      pathname === item.path
                        ? "bg-semiblueviolet text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <Link
            href="/landing"
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

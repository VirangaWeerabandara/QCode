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
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

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
    { name: "Settings", path: "/dashboard/settings", icon: CogIcon },
  ];


  return (
    <>
      {/* Mobile menu button */}
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        onClick={() => setCollapsed(!collapsed)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-midnightblue rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-Blueviolet"
        type="button"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Sidebar */}
      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          collapsed ? "-translate-x-full" : ""
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white text-midnightblue shadow-md">
          <div className="flex justify-center items-center mb-5 pt-2 pb-4 border-b border-Blueviolet/30">
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
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg group ${
                      isActive
                        ? "bg-[#6252f4] text-white"
                        : "text-midnightblue hover:bg-semiblueviolet"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition duration-75 ${
                        isActive
                          ? "text-white"
                          : "text-midnightblue group-hover:text-midnightblue"
                      }`}
                    />
                    <span className="ms-3">{item.name}</span>
                    {item.name === "My Quizzes" && (
                      <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-white bg-Blueviolet rounded-full">
                        5
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="absolute bottom-0 left-0 w-full border-t border-Blueviolet/30 p-4">
            <Link
              href="/landing"
              className="flex items-center p-2 rounded-lg text-red hover:bg-red/10 group transition duration-75"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red group-hover:text-red transition duration-75" />
              <span className="ms-3">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="p-4 sm:ml-64">
        <main className="p-0">{children}</main>
      </div>
    </>
  );
}

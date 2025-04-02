"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication check is done and no user is found, redirect to landing
    if (!isLoading && !user) {
      router.push("/landing");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lightkblue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Blueviolet"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Authenticated - show dashboard layout
  return (
    <div className="flex min-h-screen bg-lightkblue">
      <Sidebar children={undefined} />
      <main className="flex-1 p-6 mx-4 my-4">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[calc(100vh-2rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type User = {
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.replace("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-12 pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to your TourVoz account
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-4xl font-bold text-emerald-600">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {user.name || "User"}
            </h2>

            <span className="mt-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium capitalize text-emerald-700">
              {user.role || "user"}
            </span>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="mt-1 break-all font-semibold text-gray-900">
                {user.email || "Not available"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Account Role</p>
              <p className="mt-1 font-semibold capitalize text-gray-900">
                {user.role || "User"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/my-bookings" className="flex-1">
              <Button className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600">
                My Bookings
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 rounded-full"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-medium text-emerald-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

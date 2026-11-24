
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  date: string;
  status: string;
  destinationName?: string;
  destinationImage?: string;
  destinationLocation?: string;
  destinationCountry?: string;
  destinationDuration?: string;
  destinationPrice?: number;
  totalPrice?: number;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch logged-in user's bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your bookings.");
        return;
      }

      const res = await fetch(
        "http://https://tour-voz-server.onrender.com/my-bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Your session has expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Travel Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your travel booking information.
            </p>
          </div>

          <Link
            href="/destinations"
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Explore Destinations
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4 font-semibold text-blue-700">
            {message}
          </div>
        )}

        {/* Booking Count */}
        {!loading && !error && (
          <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Total Bookings</p>

            <h2 className="mt-1 text-3xl font-bold text-orange-500">
              {bookings.length}
            </h2>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center">
            Loading your bookings...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>

            <button
              onClick={fetchBookings}
              className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No Bookings Yet!
            </h2>

            <p className="mt-3 text-gray-500">
              Start exploring beautiful destinations.
            </p>

            <Link
              href="/destinations"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white"
            >
              Explore Now
            </Link>
          </div>
        )}

        {/* Booking Cards */}
        {!loading && !error && (
          <div className="grid gap-7 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
              >
                {/* Destination Image */}
                {booking.destinationImage && (
                  <img
                    src={booking.destinationImage}
                    alt={booking.destinationName || "Destination"}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">

                  {/* Destination Name and Status */}
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {booking.destinationName || "Travel Booking"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.destinationLocation || ""}
                        {booking.destinationCountry
                          ? `, ${booking.destinationCountry}`
                          : ""}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Destination Details */}
                  {booking.destinationDuration && (
                    <div className="mb-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                          Duration
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {booking.destinationDuration}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                          Price Per Person
                        </p>

                        <p className="mt-1 font-bold text-orange-500">
                          ${booking.destinationPrice ?? 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="border-t pt-5">
                    <h3 className="mb-3 font-bold text-gray-900">
                      Customer Information
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Name: {booking.name}</p>
                      <p>Email: {booking.email}</p>
                      <p>Phone: {booking.phone}</p>
                      <p>Travelers: {booking.people}</p>
                      <p>Travel Date: {booking.date}</p>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 p-4">
                    <span className="font-semibold text-gray-700">
                      Total Price
                    </span>

                    <span className="text-2xl font-bold text-orange-600">
                      ${booking.totalPrice ?? 0}
                    </span>
                  </div>

                  {/* Booking ID */}
                  <p className="mt-4 break-all text-xs text-gray-400">
                    Booking ID: {booking._id}
                  </p>

                  {/* View Details */}
                  <div className="mt-5">
                    <Link
                      href={`/booking-details/${booking._id}`}
                      className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

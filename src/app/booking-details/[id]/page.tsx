
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

function BookingDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getBooking() {
      try {
        const res = await fetch(
          "https://tour-voz-server.onrender.com/all-bookings"
        );

        if (!res.ok) {
          throw new Error("Failed to load bookings");
        }

        const data: Booking[] = await res.json();

        const foundBooking = data.find(
          (item) => item._id === id
        );

        if (!foundBooking) {
          throw new Error("Booking not found");
        }

        setBooking(foundBooking);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        Loading booking details...
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          {error || "Booking not found"}
        </h1>

        <Link
          href="/my-bookings"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 text-white"
        >
          Back to My Bookings
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-lg">
        {booking.destinationImage && (
          <img
            src={booking.destinationImage}
            alt={booking.destinationName || "Destination"}
            className="h-72 w-full object-cover"
          />
        )}

        <div className="p-6 md:p-10">
          <p className="font-semibold uppercase tracking-widest text-orange-500">
            Booking Details
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {booking.destinationName || "Travel Booking"}
          </h1>

          <p className="mt-2 text-gray-500">
            {booking.destinationLocation || ""}
            {booking.destinationCountry
              ? `, ${booking.destinationCountry}`
              : ""}
          </p>

          <div className="mt-6">
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Travel Date</p>
              <p className="mt-1 font-bold">{booking.date}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Travelers</p>
              <p className="mt-1 font-bold">{booking.people}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="mt-1 font-bold">
                {booking.destinationDuration || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Price Per Person
              </p>
              <p className="mt-1 font-bold text-orange-600">
                ${booking.destinationPrice ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold">
              Customer Information
            </h2>

            <div className="mt-4 space-y-3 text-gray-600">
              <p>Name: {booking.name}</p>
              <p>Email: {booking.email}</p>
              <p>Phone: {booking.phone}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-orange-50 p-5">
            <p className="text-gray-600">Total Price</p>
            <p className="mt-1 text-3xl font-bold text-orange-600">
              ${booking.totalPrice ?? 0}
            </p>
          </div>

          <p className="mt-6 break-all text-xs text-gray-400">
            Booking ID: {booking._id}
          </p>

          <Link
            href="/my-bookings"
            className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-10 text-center">
          Loading booking details...
        </main>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}


"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = "https://tour-voz-server.onrender.com";

type Destination = {
  _id: string;
  name: string;
  country: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  description?: string;
};

type LoggedInUser = {
  name: string;
  email: string;
};

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [destination, setDestination] =
    useState<Destination | null>(null);

  const [destinationLoading, setDestinationLoading] =
    useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("1");
  const [date, setDate] = useState("");

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      setMessage("Please login before booking a tour.");
    } else {
      try {
        const user: LoggedInUser = JSON.parse(savedUser);

        setToken(savedToken);
        setName(user.name || "");
        setEmail(user.email || "");
      } catch {
        setMessage("Please login again.");
      }
    }

    const destinationId = searchParams.get("destinationId");
    const destinationName = searchParams.get("destination");

    if (destinationId) {
      fetch(`${API_URL}/destinations/${destinationId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Destination not found");
          }
          return res.json();
        })
        .then((data) => {
          setDestination(data);
        })
        .catch(() => {
          setMessage("Could not load destination information.");
        })
        .finally(() => {
          setDestinationLoading(false);
        });

      return;
    }

    if (destinationName) {
      setDestination({
        _id: "",
        name: destinationName,
        country: "",
        location: "",
        price: 0,
        duration: "",
        image: "",
      });
    }

    setDestinationLoading(false);
  }, [searchParams]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      setMessage("Please login before booking a tour.");
      return;
    }

    let loggedInUser: LoggedInUser;

    try {
      loggedInUser = JSON.parse(savedUser);
    } catch {
      setMessage("Please login again.");
      return;
    }

    if (!loggedInUser.email) {
      setMessage("Your account email could not be found. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          name: name || loggedInUser.name,
          email: loggedInUser.email.trim().toLowerCase(),
          phone,
          people: Number(people),
          date,
          destinationId: destination?._id || "",
          destinationName: destination?.name || "",
          destinationPrice: destination?.price || 0,
          destinationImage: destination?.image || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setMessage("Your booking has been submitted successfully!");

      setPhone("");
      setPeople("1");
      setDate("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-orange-500 px-8 py-10 text-white">
            <Link
              href="/destinations"
              className="text-sm font-semibold text-white/90 hover:text-white"
            >
              ← Back to Destinations
            </Link>

            <h1 className="mt-6 text-3xl font-bold">
              Book Your Tour
            </h1>

            <p className="mt-2 text-white/90">
              Complete your information and plan your journey.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {destinationLoading && (
              <p className="mb-6 text-gray-500">
                Loading destination...
              </p>
            )}

            {destination && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                {destination.image && (
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-64 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Selected Destination
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {destination.name}
                  </h2>

                  {destination.location && (
                    <p className="mt-2 text-sm text-gray-500">
                      {destination.location}
                      {destination.country
                        ? `, ${destination.country}`
                        : ""}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    {destination.duration && (
                      <p className="text-sm font-medium text-gray-600">
                        Duration: {destination.duration}
                      </p>
                    )}

                    {destination.price > 0 && (
                      <p className="text-2xl font-bold text-orange-500">
                        ${destination.price}
                        <span className="ml-1 text-sm font-normal text-gray-500">
                          /Person
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-gray-800">
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-800">
                  Email Address (Login Account)
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  readOnly
                  placeholder="Login to load your email"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 p-3 text-gray-700 outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your booking will be saved to this account.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-800">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Number of Travelers
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Travel Date
                  </label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {message && (
                <div className="rounded-xl bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700">
                  {message}

                  {message.includes("Please login") && (
                    <div className="mt-2">
                      <Link
                        href="/login"
                        className="font-bold text-orange-600 underline"
                      >
                        Go to Login
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token || !email}
                className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "CONFIRM BOOKING →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading booking page...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

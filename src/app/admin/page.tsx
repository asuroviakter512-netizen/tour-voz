
"use client";

import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  name: string;
  email: string;
  status: string;
  phone?: string;
  people?: number;
  date?: string;
  destinationName?: string;
  totalPrice?: number;
};

type Destination = {
  _id: string;
  name: string;
};

const API = "http://https://tour-voz-server.onrender.com";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        setError("Please login with your admin account.");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Invalid login information. Please login again.");
        return;
      }

      if (
        String(user.role || "").trim().toLowerCase() !== "admin"
      ) {
        setError("Your account is not an admin account. Please login with an admin account.");
        return;
      }

      const [bookingRes, destinationRes] = await Promise.all([
        fetch(`${API}/all-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API}/destinations`),
      ]);

      if (bookingRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Your session expired. Please login again.");
      }

      if (bookingRes.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Admin permission not found in your login token. Please login again.");
      }

      if (!bookingRes.ok) {
        throw new Error("Failed to load bookings.");
      }

      if (!destinationRes.ok) {
        throw new Error("Failed to load destinations.");
      }

      const bookingData = await bookingRes.json();
      const destinationData = await destinationRes.json();

      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setDestinations(
        Array.isArray(destinationData) ? destinationData : []
      );
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Dashboard loading failed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "cancelled"
  ) {
    try {
      setActionLoading(bookingId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API}/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed.");
      }

      alert(`Booking ${status} successfully!`);
      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Booking status update failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteBooking(bookingId: string) {
    const confirmDelete = window.confirm(
      "তুমি কি এই Booking permanently delete করতে চাও?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(bookingId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API}/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed.");
      }

      alert("Booking successfully deleted!");
      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Booking delete failed."
      );
    } finally {
      setActionLoading(null);
    }
  }

  const pending = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmed = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Welcome to Tour-Voz Admin Panel
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-5">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              onClick={fetchData}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>

            <a
              href="/login"
              className="inline-block mt-4 ml-4 text-blue-700 underline"
            >
              Go to Login
            </a>
          </div>
        )}

        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-gray-500">
                  Total Destinations
                </h2>
                <p className="text-3xl font-bold mt-2">
                  {destinations.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-gray-500">
                  Total Bookings
                </h2>
                <p className="text-3xl font-bold mt-2">
                  {bookings.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-gray-500">
                  Pending Bookings
                </h2>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {pending}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-gray-500">
                  Confirmed Bookings
                </h2>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {confirmed}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl shadow mt-6">
              <h2 className="text-xl font-bold mb-4">
                Manage All Bookings
              </h2>

              {bookings.length === 0 ? (
                <p className="text-gray-500">
                  No bookings found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[750px]">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-3">Customer</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b">
                          <td className="p-3">
                            <p className="font-medium">
                              {booking.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.phone || "No phone"}
                            </p>
                          </td>

                          <td className="p-3">
                            {booking.email}
                          </td>

                          <td className="p-3">
                            {booking.destinationName || "Not specified"}
                          </td>

                          <td className="p-3">
                            {booking.date || "Not specified"}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm capitalize ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              {booking.status !== "confirmed" && (
                                <button
                                  onClick={() =>
                                    updateBookingStatus(
                                      booking._id,
                                      "confirmed"
                                    )
                                  }
                                  disabled={actionLoading === booking._id}
                                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                              )}

                              {booking.status !== "cancelled" && (
                                <button
                                  onClick={() =>
                                    updateBookingStatus(
                                      booking._id,
                                      "cancelled"
                                    )
                                  }
                                  disabled={actionLoading === booking._id}
                                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  deleteBooking(booking._id)
                                }
                                disabled={actionLoading === booking._id}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>

                            {actionLoading === booking._id && (
                              <p className="text-xs text-gray-500 mt-2">
                                Updating...
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                Cancelled Bookings: {cancelled}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

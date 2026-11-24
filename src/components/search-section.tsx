
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Destination = {
  _id: string;
  name: string;
  country?: string;
  location?: string;
};

const API_URL = "https://tour-voz-server.onrender.com";

export function SearchSection() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [error, setError] = useState("");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Today's date: calculate after the page loads in the browser
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();

    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedDate);
  }, []);

  // Get destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/destinations`);

        if (!response.ok) {
          throw new Error("Failed to load destinations");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDestinations(data);
          setFilteredDestinations(data);
        }
      } catch (err) {
        console.error("Destination loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter destinations
  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setShowDropdown(true);
    setError("");

    const filtered = destinations.filter((item) => {
      const fullName = `${item.name} ${item.country || ""} ${
        item.location || ""
      }`;

      return fullName.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredDestinations(filtered);
  };

  // Select destination
  const selectDestination = (item: Destination) => {
    setDestination(item.name);
    setShowDropdown(false);
    setError("");
  };

  // Search
  const handleSearch = () => {
    setError("");

    if (!destination.trim()) {
      setError("Please select a destination.");
      return;
    }

    if (!checkIn) {
      setError("Please select your check-in date.");
      return;
    }

    if (today && checkIn < today) {
      setError("Please select today or a future date.");
      return;
    }

    if (
      !travelers ||
      Number(travelers) < 1 ||
      Number(travelers) > 50
    ) {
      setError("Please enter between 1 and 50 travelers.");
      return;
    }

    const params = new URLSearchParams({
      search: destination.trim(),
      date: checkIn,
      travelers: travelers,
    });

    setShowDropdown(false);
    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <section className="relative z-30 -mt-16 px-5">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Destination */}
          <div className="relative flex flex-col gap-2">
            <label
              htmlFor="destination"
              className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            >
              Destination
            </label>

            <Input
              id="destination"
              type="text"
              placeholder="Where to?"
              value={destination}
              autoComplete="off"
              onFocus={() => {
                setShowDropdown(true);

                setFilteredDestinations(
                  destinations.filter((item) => {
                    const fullName = `${item.name} ${
                      item.country || ""
                    } ${item.location || ""}`;

                    return fullName
                      .toLowerCase()
                      .includes(destination.toLowerCase());
                  })
                );
              }}
              onChange={(e) =>
                handleDestinationChange(e.target.value)
              }
              className="h-11 rounded-lg border-gray-200"
            />

            {/* Destination Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-2xl">
                <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                  {destination
                    ? "Matching Destinations"
                    : "Popular Destinations"}
                </p>

                {loading ? (
                  <p className="px-3 py-4 text-sm text-gray-500">
                    Loading destinations...
                  </p>
                ) : filteredDestinations.length > 0 ? (
                  filteredDestinations.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectDestination(item)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-emerald-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {item.name}
                        </span>

                        <span className="block text-xs text-gray-500">
                          {[item.location, item.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-sm text-gray-500">
                    No destinations found.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="checkin"
              className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            >
              Check-in
            </label>

            <Input
              id="checkin"
              type="date"
              min={today || undefined}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="h-11 rounded-lg border-gray-200"
            />
          </div>

          {/* Travelers */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="travelers"
              className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            >
              Travelers
            </label>

            <Input
              id="travelers"
              type="number"
              min="1"
              max="50"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="h-11 rounded-lg border-gray-200"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleSearch}
              className="h-11 w-full rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Search
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

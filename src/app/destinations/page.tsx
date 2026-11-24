
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Destination = {
  _id: string;
  name?: string;
  destination?: string;
  country?: string;
  location?: string;
  price?: string | number;
  duration?: string;
  image?: string;
  description?: string;
};

export default function DestinationsPage() {
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // Read search from URL
  useEffect(() => {
    const searchValue = searchParams.get("search") || "";
    setSearch(searchValue);
  }, [searchParams]);

  // Fetch destinations
  useEffect(() => {
    async function getDestinations() {
      try {
        const res = await fetch("http://localhost:8000/destinations");

        if (!res.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const data: Destination[] = await res.json();

        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    }

    getDestinations();
  }, []);

  // Filter destinations
  const filteredDestinations = destinations.filter((destination) => {
    const name = destination.name || destination.destination || "";
    const location = destination.location || "";
    const country = destination.country || "";

    const fullName = `${name} ${location} ${country}`;

    return fullName.toLowerCase().includes(search.trim().toLowerCase());
  });

  // Delete destination
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as admin first.");
      return;
    }

    try {
      setDeletingId(id);

      const res = await fetch(
        `http://localhost:8000/destinations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete destination");
      }

      setDestinations((previous) =>
        previous.filter((destination) => destination._id !== id)
      );

      alert("Destination deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete destination."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Heading and Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              All Destinations
            </h1>

            <p className="mt-2 text-gray-600">
              Explore beautiful places and plan your next journey.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Showing {filteredDestinations.length} destinations
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Input
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />

            <Button
              type="button"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => {
                const params = new URLSearchParams();

                if (search.trim()) {
                  params.set("search", search.trim());
                }

                const date = searchParams.get("date");
                const travelers = searchParams.get("travelers");

                if (date) params.set("date", date);
                if (travelers) params.set("travelers", travelers);

                window.history.replaceState(
                  null,
                  "",
                  `/destinations${params.toString() ? `?${params.toString()}` : ""}`
                );
              }}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-gray-600">
            Loading destinations...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="py-10 text-center text-red-500">
            {error}
          </p>
        )}

        {/* No Results */}
        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              No destinations found!
            </h2>

            <p className="mt-2 text-gray-500">
              Try searching with another destination name.
            </p>

            <Button
              className="mt-5 bg-emerald-500 text-white"
              onClick={() => {
                setSearch("");
                window.history.replaceState(null, "", "/destinations");
              }}
            >
              Show All Destinations
            </Button>
          </div>
        )}

        {/* Destination Cards */}
        {!loading && !error && filteredDestinations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.map((destination) => {
              const destinationName =
                destination.name ||
                destination.destination ||
                "Destination";

              return (
                <Card
                  key={destination._id}
                  className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={
                        destination.image ||
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                      }
                      alt={destinationName}
                      fill
                      unoptimized
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {destinationName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {[destination.location, destination.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {destination.description?.trim() ||
                        "Explore this beautiful destination and enjoy an unforgettable travel experience."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-emerald-600">
                          ${destination.price ?? "N/A"}
                          <span className="text-xs font-normal text-gray-500">
                            /Person
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {destination.duration ||
                            "Duration unavailable"}
                        </p>
                      </div>

                      <Link href={`/destinations/${destination._id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>

                    {/* Admin Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/edit-destination/${destination._id}`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                        disabled={deletingId === destination._id}
                        onClick={() => handleDelete(destination._id)}
                      >
                        {deletingId === destination._id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>

                    {/* Booking */}
                    <Link
                      href={`/booking?destination=${encodeURIComponent(destinationName)}`}
                      className="mt-4 block text-center text-sm font-bold text-sky-600 transition hover:text-sky-800"
                    >
                      BOOK NOW ↗
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

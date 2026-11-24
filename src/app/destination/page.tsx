
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("https://tour-voz-server.onrender.com/destinations");

        if (!res.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const data: Destination[] = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((destination) => {
    const name = destination.name || destination.destination || "";
    const location = destination.location || "";
    const country = destination.country || "";

    const searchText = `${name} ${location} ${country}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore All Destinations
            </h1>

            <p className="mt-2 text-gray-600">
              Find your perfect travel experience from our curated collection.
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
              onClick={() => setSearch(search.trim())}
            >
              Search
            </Button>
          </div>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-500">
            Loading destinations...
          </p>
        )}

        {error && (
          <p className="py-10 text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && filteredDestinations.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            No destinations found.
          </p>
        )}

        {!loading && !error && filteredDestinations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.map((destination) => (
              <Card
                key={destination._id}
                className="overflow-hidden transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {destination.image ? (
                    <Image
                      src={destination.image}
                      alt={
                        destination.name ||
                        destination.destination ||
                        "Destination"
                      }
                      fill
                      className="object-cover transition duration-300 hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-200">
                      No Image
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(
                      destination.name ||
                      destination.destination ||
                      "Unknown Destination"
                    ).trim()}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {destination.location}
                    {destination.country
                      ? `, ${destination.country}`
                      : ""}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {destination.description}
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
                        {destination.duration || "Duration not available"}
                      </p>
                    </div>

                    <Link href={`/destinations/${destination._id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Destination = {
  _id: string;
  name: string;
  country?: string;
  location?: string;
  price?: number | string;
  duration?: string;
  image?: string;
  description?: string;
};

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch(
          "https://tour-voz-server.onrender.com/destinations"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const data = await response.json();

        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Destination loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Popular Destinations
        </h2>

        <p className="mt-2 text-gray-600">
          Explore amazing places added to Tour-Voz.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">
          Loading destinations...
        </p>
      ) : destinations.length === 0 ? (
        <p className="text-gray-500">
          No destinations available. Please add a destination first.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <article
              key={destination._id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {destination.image ? (
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {destination.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {destination.location || destination.country || ""}
                </p>

                <p className="mt-2 text-sm font-medium text-emerald-600">
                  {destination.price !== undefined &&
                  destination.price !== ""
                    ? `From $${destination.price}`
                    : "Price not available"}
                </p>

                {destination.duration && (
                  <p className="mt-1 text-sm text-gray-500">
                    {destination.duration}
                  </p>
                )}

                <Link
                  href={`/destinations/${destination._id}`}
                  className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

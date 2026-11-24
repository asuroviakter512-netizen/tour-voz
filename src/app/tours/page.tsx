
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Destination = {
  _id: string;
  name: string;
  country: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  description: string;
};

export default function ToursPage() {
  const [tours, setTours] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tour-voz-server.onrender.com/destinations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tours");
        return res.json();
      })
      .then((data) => setTours(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-emerald-600 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          Explore Our Tours
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Discover beautiful destinations and plan your next
          unforgettable journey with Tour-Voz.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">All Travel Packages</h2>
            <p className="mt-2 text-muted-foreground">
              Find your perfect destination.
            </p>
          </div>

          <Link
            href="/add-destination"
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            + Add Destination
          </Link>
        </div>

        {loading ? (
          <p className="py-16 text-center">Loading tours...</p>
        ) : tours.length === 0 ? (
          <p className="py-16 text-center">
            No tours available yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <div
                key={tour._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {tour.image && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-bold">{tour.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    {tour.location}, {tour.country}
                  </p>

                  <p className="line-clamp-3 text-sm">
                    {tour.description}
                  </p>

                  <div className="flex justify-between border-t pt-4">
                    <span className="text-sm font-medium">
                      {tour.duration}
                    </span>
                    <span className="font-bold text-emerald-600">
                      ${tour.price}
                    </span>
                  </div>

                  <Link
                    href={`/destinations/${tour._id}`}
                    className="block rounded-lg bg-emerald-600 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/booking?destination=${tour._id}`}
                    className="block rounded-lg border border-emerald-600 py-3 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

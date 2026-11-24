
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

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

type PageProps = {
  params: Promise<{ id: string }>;
};

async function DestinationDetails({ params }: PageProps) {
  const { id } = await params;

  let destination: Destination;

  try {
    const res = await fetch(
      `http://https://tour-voz-server.onrender.com/destinations/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            Destination not found!
          </h1>
        </main>
      );
    }

    destination = await res.json();
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">
          Server connection failed!
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[500px]">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          priority
          unoptimized
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <p className="text-white uppercase tracking-[4px] mb-4">
            Explore the world
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {destination.name}
          </h1>

          <p className="text-white text-lg mt-4">
            {destination.location}, {destination.country}
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest">
              About this destination
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-5">
              Discover {destination.name}
            </h2>

            <p className="text-gray-600 leading-8 text-lg">
              {destination.description ||
                "Discover this beautiful destination and enjoy an unforgettable travel experience."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-9">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Location</p>
                <p className="font-semibold text-gray-900 mt-2">
                  {destination.location}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Country</p>
                <p className="font-semibold text-gray-900 mt-2">
                  {destination.country}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Duration</p>
                <p className="font-semibold text-gray-900 mt-2">
                  {destination.duration}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">Destination ID</p>
                <p className="font-semibold text-gray-900 mt-2 break-all">
                  {destination._id}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-white rounded-2xl p-7 shadow-md h-fit">
            <p className="text-gray-500 font-medium">
              Starting from
            </p>

            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              ${destination.price}
            </h2>

            <p className="text-gray-500 mt-2">
              Per person
            </p>

            <div className="border-t my-6" />

            <div className="flex justify-between mb-5">
              <span className="text-gray-500">Duration</span>
              <span className="font-semibold text-gray-900">
                {destination.duration}
              </span>
            </div>

            <div className="flex justify-between mb-7">
              <span className="text-gray-500">Destination</span>
              <span className="font-semibold text-gray-900">
                {destination.name}
              </span>
            </div>

            {/* Book Now Button */}
            <Link
              href="/booking"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition text-center"
            >
              Book Now
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">
              Plan your next unforgettable journey.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link
            href="/destinations"
            className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Destinations
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function DestinationDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading destination...
        </div>
      }
    >
      <DestinationDetails params={params} />
    </Suspense>
  );
}

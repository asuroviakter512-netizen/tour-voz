
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-emerald-600 px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          About Tour-Voz
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg">
          Your trusted partner for discovering beautiful
          destinations and unforgettable travel experiences.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-5 text-3xl font-bold">
              Discover the World with Us
            </h2>

            <p className="mb-4 leading-7 text-muted-foreground">
              Tour-Voz is a travel platform designed to help
              travelers explore amazing destinations, discover
              exciting tour packages, and plan memorable journeys.
            </p>

            <p className="leading-7 text-muted-foreground">
              From beautiful beaches to peaceful mountains,
              we make it easier for you to find your next
              favorite travel destination.
            </p>

            <Link
              href="/tours"
              className="mt-8 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Explore Our Tours
            </Link>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-8">
            <h3 className="mb-6 text-2xl font-bold text-emerald-800">
              Why Choose Tour-Voz?
            </h3>

            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-emerald-700">
                  Beautiful Destinations
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Explore amazing places around the world.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-emerald-700">
                  Easy Booking
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Book your favorite travel packages easily.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-emerald-700">
                  Memorable Experiences
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Make every journey special and unforgettable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

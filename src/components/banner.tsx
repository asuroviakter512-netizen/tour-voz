
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Banner() {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
        alt="Tropical beach paradise"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Explore The World With Us
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Discover breathtaking destinations, curated tours, and unforgettable
          journeys — all in one place. Your next adventure starts here.
        </p>

        <div className="mt-8">
          <Link href="/tours">
            <Button
              size="lg"
              className="rounded-full bg-emerald-500 px-8 text-white hover:bg-emerald-600"
            >
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

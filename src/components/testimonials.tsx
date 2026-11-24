import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Traveler",
    quote:
      "TourVoz made our Bali trip absolutely magical. Every detail was perfectly arranged.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "David Lee",
    role: "Traveler",
    quote:
      "Best travel experience ever. The guides were knowledgeable and friendly.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Emily Chen",
    role: "Traveler",
    quote: "Seamless booking and incredible value. Highly recommend TourVoz!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            What Our Travelers Say
          </h2>
          <p className="mt-2 text-gray-600">
            Real stories from real adventurers.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <p className="text-gray-700">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

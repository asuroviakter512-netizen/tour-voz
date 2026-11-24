import { Globe, Headphones, ShieldCheck, Wallet } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Worldwide Destinations",
    description: "Explore hundreds of curated destinations across the globe.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description: "Your bookings and payments are protected end to end.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our travel experts are always ready to assist you.",
  },
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    description: "We match prices so you always get the best deal.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Why Choose TourVoz
        </h2>
        <p className="mt-2 text-gray-600">
          Travel with confidence and comfort.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

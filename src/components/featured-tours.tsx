
import Link from "next/link";

const featuredTours = [
  {
    id: 1,
    title: "Beijing Imperial Highlights & Great Wall",
    category: "Family Experiences",
    duration: "3 Days / 2 Nights",
    type: "Multi-Day Tour",
    price: 499,
    description:
      "Explore the magnificent Great Wall of China, discover the Forbidden City and experience Beijing's rich imperial history and traditional culture.",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Chengdu Pandas & Sichuan Flavors",
    category: "Culture & Heritage",
    duration: "2 Days / 1 Night",
    type: "Multi-Day Tour",
    price: 329,
    description:
      "Visit the famous Chengdu Panda Base, discover beautiful traditional streets and enjoy the unique culture and spicy flavors of Sichuan cuisine.",
    image:
      "https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Guangzhou Old City & Cantonese Food Discovery",
    category: "Food & Culinary",
    duration: "1 Day",
    type: "Day Tour",
    price: 159,
    description:
      "Discover authentic Cantonese cuisine and taste delicious dim sum, steamed dumplings, traditional noodles and local street food while exploring Guangzhou's historic food streets.",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85",
  },
];

export function FeaturedTours() {
  return (
    <section className="bg-[#fbfaf7] px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            Featured Experiences
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Featured Tours
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Explore handpicked tours designed to help you experience
            amazing destinations with local insight and flexibility.
          </p>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <article
              key={tour.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Tour Image */}
              <div className="h-64 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Tour Information */}
              <div className="flex flex-1 flex-col p-6">

                <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  <span>{tour.type}</span>
                  <span>•</span>
                  <span>{tour.duration}</span>
                </div>

                <h3 className="text-xl font-bold leading-snug text-slate-950">
                  {tour.title}
                </h3>

                <p className="mt-3 text-xs font-semibold text-amber-700">
                  {tour.category}
                </p>

                {/* Tour Description */}
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {tour.description}
                </p>

                {/* Price and Button */}
                <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-6 mt-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      From
                    </p>

                    <p className="text-xl font-extrabold text-slate-950">
                      ${tour.price}
                    </p>
                  </div>

                  <Link
                    href="/destinations"
                    className="text-sm font-bold text-amber-700 transition-colors hover:text-emerald-600"
                  >
                    View Tour <span aria-hidden="true">→</span>
                  </Link>
                </div>

              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

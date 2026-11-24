import { Banner } from "@/components/banner";
import { FeaturedTours } from "@/components/featured-tours";


import { PopularDestinations } from "@/components/popular-destinations";
import { SearchSection } from "@/components/search-section";
import { Testimonials } from "@/components/testimonials";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      
      <Banner />
      <SearchSection />
      <PopularDestinations />
      <FeaturedTours />
      <WhyChooseUs />
      <Testimonials />
     
    </main>
  );
}

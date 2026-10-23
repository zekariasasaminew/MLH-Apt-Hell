import { ActionCards } from "@/components/home/ActionCards";
import { Hero } from "@/components/home/Hero";
import { ListingCarousel } from "@/components/home/ListingCarousel";
import { MoreRecommended } from "@/components/home/MoreRecommended";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { listings } from "@/data/listings";

const trending = listings.filter((listing) => listing.city === "Rock Island");
const affordable = [...listings].sort((a, b) => a.rent - b.rent).slice(0, 8);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ListingCarousel
          title="Trending Homes in Rock Island, IL"
          subtitle="Viewed and saved the most in the area over the past 24 hours"
          listings={trending}
        />
        <ListingCarousel
          title={
            <>
              Find homes you can afford with RentAbility<sup>SM</sup>
            </>
          }
          subtitle="Answer a few questions. We'll highlight homes you're likely to qualify for."
          listings={affordable}
          badge="Within RentAbility"
        />
        <MoreRecommended />
        <ActionCards />
      </main>
      <SiteFooter />
    </>
  );
}

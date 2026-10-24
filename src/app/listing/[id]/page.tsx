import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { money, salePrice } from "@/data/property-market";
import type { Listing } from "@/data/listings";
import { SiteHeader } from "@/components/site/SiteHeader";
import { formatRent, getListing, listings } from "@/data/listings";
import { TourScheduler } from "../analog-tours/TourScheduler";
import styles from "./page.module.css";
import { ScratchGallery } from "../scratch-photos/ScratchGallery";
import { RotaryContact } from "../rotary-contact/RotaryContact";

export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
}

export default async function ListingPage({ params, searchParams }: PageProps<"/listing/[id]">) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <ScratchGallery listing={listing} />
        <Suspense fallback={<h1>{listing.street}</h1>}>
          <ListingSummary listing={listing} searchParams={searchParams} />
        </Suspense>
        <TourScheduler key={id} listingId={id} street={listing.street} />
        <RotaryContact />
      </main>
    </>
  );
}

async function ListingSummary({ listing, searchParams }: { listing: Listing } & Pick<PageProps<"/listing/[id]">, "searchParams">) {
  const params = await searchParams;
  const buy = params.intent === "buy";
  return <section className={styles.summary}>
    <Link href={buy ? "/search?type=buy" : "/rent"}>← Back to {buy ? "homes for sale" : "rentals"}</Link>
    <h1>{listing.street}</h1>
    <h2>{buy ? money(salePrice(listing)) : formatRent(listing.rent)}</h2>
    <p>{listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString("en-US")} sqft · {listing.city}, {listing.state}</p>
    <p>{listing.homeType} for {buy ? "sale" : "rent"}. {listing.finePrint}</p>
    {buy && <p>Fictional sale scenario based on a demo rental. No actual home is offered for sale.</p>}
    <Link className={styles.apply} href={`/apply?listing=${listing.id}${buy ? "&intent=buy" : ""}`}>Start a simulated application</Link>
  </section>;
}

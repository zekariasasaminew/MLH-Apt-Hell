import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";
import { SiteHeader } from "@/components/site/SiteHeader";
import { formatRent, getListing, listings } from "@/data/listings";
import styles from "./page.module.css";
import { ScratchGallery } from "../scratch-photos/ScratchGallery";
import { RotaryContact } from "../rotary-contact/RotaryContact";

export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
}

export default async function ListingPage({ params }: PageProps<"/listing/[id]">) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <ScratchGallery listing={listing} />
        <Placeholder route={`/listing/${id}`}>
          <h1>{listing.street}</h1>
          <p>
            {formatRent(listing.rent)} · {listing.beds} bd · {listing.baths} ba · {listing.city}, {listing.state}
          </p>
          <p>Unclaimed. Photo gallery, details, &quot;Request a tour&quot; and &quot;Apply now&quot; (links to /apply).</p>
        </Placeholder>
        <RotaryContact />
      </main>
    </>
  );
}

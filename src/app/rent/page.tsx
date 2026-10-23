import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { RentPage } from "./RentPage";

export const metadata: Metadata = {
  title: "Rental Listings in the Quad Cities | Hellow",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense fallback={<p>Loading rentals…</p>}>
          <RentPage />
        </Suspense>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ListingSpinner } from "./ListingSpinner";

export const metadata: Metadata = { title: "Listing Spinner | Hellow" };

export default function SpinPage() {
  return <><SiteHeader /><ListingSpinner /><SiteFooter /></>;
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MortgageChallenge } from "./MortgageChallenge";

export const metadata: Metadata = { title: "Get a Mortgage | Hellow" };

export default function MortgagePage() {
  return <><SiteHeader /><MortgageChallenge /><SiteFooter /></>;
}

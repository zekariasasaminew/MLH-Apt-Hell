import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { RentPage } from "../rent/RentPage";
import { SellHome } from "./SellHome";
import styles from "./page.module.css";

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return <><SiteHeader /><main><Suspense fallback={<p className={styles.loading}>Finding homes and additional paperwork…</p>}><SearchContent searchParams={searchParams} /></Suspense></main></>;
}

async function SearchContent({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const type = first(params.type);
  if (type === "rent") {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key !== "type" && value !== undefined) query.set(key, first(value) ?? "");
    }
    redirect(query.size ? `/rent?${query}` : "/rent");
  }
  if (type === "sell") return <><div className={styles.main}><SellHome /></div><SiteFooter /></>;
  if (type === "agent") return <><section className={`${styles.main} ${styles.seller}`}><h1>Find an imaginary agent</h1><p>Browse a home, then use its rotary telephone to request a pretend callback.</p><Link className={styles.primary} href="/rent">Choose a property</Link></section><SiteFooter /></>;
  return <RentPage mode="buy" />;
}

import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cities, listings } from "@/data/listings";
import { BuyHomes } from "./BuyHomes";
import { SellHome } from "./SellHome";
import { money, salePrice } from "./market";
import styles from "./page.module.css";

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return <><SiteHeader /><main className={styles.main}><Suspense fallback={<p className={styles.loading}>Finding homes and additional paperwork…</p>}><SearchContent searchParams={searchParams} /></Suspense></main><SiteFooter /></>;
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
  if (type === "sell") return <SellHome />;
  if (type === "agent") return <section className={styles.seller}><h1>Find an imaginary agent</h1><p>Browse a home, then use its rotary telephone to request a pretend callback.</p><Link className={styles.primary} href="/rent">Choose a property</Link></section>;
  const q = first(params.q)?.trim() ?? "";
  const city = first(params.city) ?? "";
  const rawMax = Number(first(params.saleMax));
  const max = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : undefined;
  const sort = first(params.sort) === "price-asc" ? "price-asc" : "price-desc";
  const homes = listings.filter(home => (!city || city === home.citySlug) && (!max || salePrice(home) <= max) && `${home.street} ${home.city} ${home.state} ${home.zip}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => sort === "price-asc" ? salePrice(a) - salePrice(b) : salePrice(b) - salePrice(a));
  return <section className={styles.buy}>
    <p className={styles.eyebrow}>Quad Cities · fictional homes for sale</p><h1>Buy a home. Finance the regret.</h1><p>Demo homes, imaginary sale prices, very real amounts of clicking.</p>
    <form action="/search" className={styles.filters} role="search"><input type="hidden" name="type" value="buy" /><label className={styles.field}>Address, city, or ZIP<input name="q" defaultValue={q} placeholder="Try Rock Island" /></label><label className={styles.field}>City<select name="city" defaultValue={city}><option value="">All cities</option>{cities.map(city => <option key={city.slug} value={city.slug}>{city.label}, {city.state}</option>)}</select></label><label className={styles.field}>Maximum purchase price<select name="saleMax" defaultValue={max ?? ""}><option value="">Any price</option>{[200000, 300000, 400000, 500000, 750000].map(price => <option key={price} value={price}>{money(price)}</option>)}{max && ![200000, 300000, 400000, 500000, 750000].includes(max) && <option value={max}>{money(max)}</option>}</select></label><label className={styles.field}>Sort<select name="sort" defaultValue={sort}><option value="price-desc">Most financially devastating</option><option value="price-asc">Least financially devastating</option></select></label><button className={styles.primary}>Submit for housing consideration</button></form>
    <div className={styles.resultsHeading}><h2>{homes.length} fictional homes</h2><Link href="/rent">Looking for rentals?</Link></div>
    {homes.length ? <BuyHomes homes={homes} /> : <div className={styles.empty}><h2>No homes match your demands</h2><p>The market has considered your request and shrugged.</p><Link className={styles.primary} href="/search?type=buy">Clear filters</Link></div>}
  </section>;
}

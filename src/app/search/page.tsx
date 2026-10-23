import { Suspense } from "react";
import { Placeholder } from "@/components/site/Placeholder";
import { SiteHeader } from "@/components/site/SiteHeader";
import styles from "./page.module.css";

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <Placeholder route="/search">
          <h1>Search results</h1>
          <Suspense fallback={<p>Loading your query…</p>}>
            <Query searchParams={searchParams} />
          </Suspense>
          <p>Unclaimed. Map + list of listings from src/data/listings.ts, with filters that get worse with pain.</p>
        </Placeholder>
      </main>
    </>
  );
}

async function Query({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q, type } = await searchParams;
  return (
    <p>
      Query: <b>{q || "(empty)"}</b>, type: <b>{type || "any"}</b>
    </p>
  );
}

import Link from "next/link";
import { BuyIllustration, RentIllustration, SellIllustration } from "./Illustrations";
import styles from "./ActionCards.module.css";

const cards = [
  {
    title: "Buy a home",
    body: "Find your place with an immersive photo experience and the most listings, including several that exist.",
    cta: "Search homes",
    href: "/search?type=buy",
    Illustration: BuyIllustration,
  },
  {
    title: "Sell a home",
    body: "No matter what path you take to sell your home, we can help you navigate a sale, eventually.",
    cta: "See your options",
    href: "/search?type=sell",
    Illustration: SellIllustration,
  },
  {
    title: "Rent a home",
    body: "We're creating a seamless online experience, from shopping on the largest rental network, to applying, to applying again.",
    cta: "Find rentals",
    href: "/rent",
    Illustration: RentIllustration,
  },
];

export function ActionCards() {
  return (
    <section className={styles.band}>
      <div className={styles.grid}>
        {cards.map(({ title, body, cta, href, Illustration }) => (
          <div key={title} className={styles.card}>
            <Illustration />
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.body}>{body}</p>
            <Link href={href} className={styles.cta}>
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

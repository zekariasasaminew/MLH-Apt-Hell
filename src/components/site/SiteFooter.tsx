import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

const directories = [
  { label: "Real Estate", links: ["Rock Island real estate", "Moline real estate", "Davenport real estate", "Bettendorf real estate"] },
  { label: "Rentals", links: ["Rock Island apartments", "Moline apartments", "Davenport apartments", "Bettendorf apartments"] },
  { label: "Mortgage Rates", links: ["Current rates", "Rates you won't get", "Refinance regret calculator"] },
  { label: "Browse Homes", links: ["Illinois", "Iowa", "Homes near campus", "Homes near the river"] },
];

const footerLinks = [
  "About", "Hellowstimates", "News", "Research", "Careers", "Applicant Privacy Notice", "Help", "Advertise",
  "Fair Housing Guide", "Advocacy", "Terms of use", "Privacy Notice", "Ad Choices", "Cookie Preference", "Learn",
  "AI", "Mobile Apps",
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.about}>
        <h6 className={styles.aboutTitle}>About Hellow&apos;s Recommendations</h6>
        <p>
          Recommendations are based on your location and search activity, such as the homes you&apos;ve viewed and
          saved and the filters you&apos;ve used. We use this information to bring similar homes to your attention, so
          you don&apos;t miss out.
        </p>
      </div>

      <ul className={styles.directories}>
        {directories.map((directory) => (
          <li key={directory.label}>
            <details className={styles.directory}>
              <summary>
                {directory.label}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ul>
                {directory.links.map((label) => (
                  <li key={label}>
                    <Link href="/search">{label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      <nav className={styles.links} aria-label="Footer">
        {footerLinks.map((label) => (
          <Link key={label} href="/signin">
            {label}
          </Link>
        ))}
      </nav>
      <Link href="/signin" className={styles.doNotSell}>
        Do Not Sell or Share My Personal Information →
      </Link>

      <div className={styles.legal}>
        <p>
          Hellow Group is committed to ensuring digital accessibility for individuals with disabilities. We are
          continuously working to improve the accessibility of our web experience for everyone, and we welcome
          feedback and accommodation requests. If you wish to report an issue or seek an accommodation, please{" "}
          <Link href="/signin">let us know</Link>.
        </p>
        <p>
          Hellow, Inc. holds real estate brokerage licenses in zero states. All rental information is provided by
          Hellow Rentals, LLC, which is not a real company. Equal Housing Opportunity, unequal housing patience.
        </p>
        <p>
          Hellow is a parody built for a hackathon. It is not affiliated with, endorsed by, or connected to Zillow
          Group, Inc. No real listings, landlords, or homes are represented.
        </p>
      </div>

      <div className={styles.bottom}>
        <Logo size={20} />
        <span className={styles.follow}>Follow us:</span>
        <span className={styles.copyright}>© 2006-2026 Hellow</span>
        <svg className={styles.equalHousing} viewBox="0 0 24 24" aria-label="Equal housing opportunity">
          <path d="M12 2 2 9h3v11h14V9h3L12 2Zm-4 9h8v2H8v-2Zm0 4h8v2H8v-2Z" fill="currentColor" />
        </svg>
      </div>
    </footer>
  );
}

import { Placeholder } from "@/components/site/Placeholder";
import styles from "./page.module.css";

export default function ApplyPage() {
  return (
    <main className={styles.main}>
      <Placeholder route="/apply">
        <h1>Rental application</h1>
        <p>Unclaimed. A multi-step application (fake, nothing is submitted anywhere). Maximum misery lives here.</p>
      </Placeholder>
    </main>
  );
}

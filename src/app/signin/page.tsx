import { Placeholder } from "@/components/site/Placeholder";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.main}>
      <Placeholder route="/signin">
        <h1>Sign in</h1>
        <p>Unclaimed. A sign-in / create-account flow (fake, cookie only) that fights the user more as pain rises.</p>
      </Placeholder>
    </main>
  );
}

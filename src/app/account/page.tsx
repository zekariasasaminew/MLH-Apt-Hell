"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AVATARS, PERSONALITIES, VOICE_LINES } from "./data";
import { CancelSubscriptionFlow } from "./CancelSubscriptionFlow";
import styles from "./page.module.css";

const SECTIONS = ["Profile", "Notifications", "Housing Preferences", "Privacy-ish", "Login & Security", "Subscription", "Miscellaneous Regrets"] as const;
type Section = (typeof SECTIONS)[number];

type Draft = {
  displayName: string;
  username: string;
  bio: string;
  theme: string;
  notifications: Record<string, boolean>;
  frequency: string;
  location: string;
  maxBudget: number;
  commute: string;
  amenities: string[];
  publicProfile: boolean;
  recommendations: boolean;
  locationUsage: boolean;
  avatarId: string;
  chaosLevel: number;
};

const DEFAULT_DRAFT: Draft = {
  displayName: "Future Homeowner, Allegedly",
  username: "rent_is_temporary_67",
  bio: "Browsing homes I cannot afford with tremendous confidence.",
  theme: "Open-House Migraine",
  notifications: {
    "New property alerts": true,
    "Price changes": true,
    "Important opportunities": false,
    "Extremely important opportunities": true,
    "Emotional support notifications": true,
    "We just wanted to check in": false,
  },
  frequency: "Every seven minutes",
  location: "Somewhere with legal windows",
  maxBudget: 420069,
  commute: "Podcasts make anything possible",
  amenities: ["Refrigerator light", "Suspicious basement"],
  publicProfile: false,
  recommendations: true,
  locationUsage: false,
  avatarId: "",
  chaosLevel: 3,
};

const AMENITIES = [
  "Refrigerator light",
  "Load-bearing poster",
  "Suspicious basement",
  "Emotionally supportive outlet",
  "Window facing another window",
  "Previous tenant's Wi-Fi",
];

export default function AccountPage() {
  const [active, setActive] = useState<Section>("Profile");
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [saved, setSaved] = useState<Draft>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [favoriteNumber, setFavoriteNumber] = useState("");
  const [notAgents, setNotAgents] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [avatarConfirmed, setAvatarConfirmed] = useState(false);
  const [alignment, setAlignment] = useState("");
  const [mascotMuted, setMascotMuted] = useState(false);
  const [voiceLine, setVoiceLine] = useState("The account council is monitoring your beige levels.");
  const [searchReply, setSearchReply] = useState("");
  const [saveStep, setSaveStep] = useState(0);
  const [saveCode, setSaveCode] = useState("");
  const [holding, setHolding] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem("hellow_account_draft");
      const storedSaved = localStorage.getItem("hellow_account_saved");
      if (storedDraft) setDraft({ ...DEFAULT_DRAFT, ...JSON.parse(storedDraft) });
      if (storedSaved) setSaved({ ...DEFAULT_DRAFT, ...JSON.parse(storedSaved) });
      setVerified(localStorage.getItem("hellow_account_verified") === "yes");
      setShowCancel(localStorage.getItem("hellow_cancel_open") === "yes");
    } catch {
      setVoiceLine("Local storage has been declared structurally questionable.");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("hellow_account_draft", JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  const avatar = AVATARS.find((item) => item.id === (selectedAvatar || draft.avatarId));
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const changeCount = useMemo(() => Object.keys(draft).filter((key) => JSON.stringify(draft[key as keyof Draft]) !== JSON.stringify(saved[key as keyof Draft])).length, [draft, saved]);
  const profileProgress = Math.max(17, 96 - changeCount * 7);
  const curse = Math.min(100, draft.chaosLevel * 13 + (draft.maxBudget === 67 ? 33 : 0) + (draft.notifications["Extremely important opportunities"] ? 11 : 0));

  function patchDraft(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    if (!mascotMuted) setVoiceLine(VOICE_LINES[Math.floor(Math.random() * VOICE_LINES.length)]);
  }

  function verifyIdentity() {
    if (favoriteNumber !== "67" || !notAgents) {
      setVerificationError(favoriteNumber !== "67" ? "Incorrect. The sacred number has filed an appeal." : "The trench-coat declaration remains dangerously unsigned.");
      return;
    }
    setVerified(true);
    localStorage.setItem("hellow_account_verified", "yes");
    setVerificationError("");
  }

  function spinAlignment() {
    const result = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
    setAlignment(result);
  }

  function confirmAvatar() {
    if (!selectedAvatar || !alignment) {
      setVoiceLine("You cannot enter the housing market without a champion and a wheel judgment.");
      return;
    }
    patchDraft({ avatarId: selectedAvatar });
    setAvatarConfirmed(true);
    setVoiceLine(AVATARS.find((item) => item.id === selectedAvatar)?.catchphrase ?? "Creature confirmed.");
  }

  function toggleAmenity(amenity: string) {
    patchDraft({ amenities: draft.amenities.includes(amenity) ? draft.amenities.filter((item) => item !== amenity) : [...draft.amenities, amenity] });
  }

  function beginHold() {
    if (holding) return;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      setHolding(false);
      setSaveStep(4);
      setTimeout(() => {
        setSaved(draft);
        localStorage.setItem("hellow_account_saved", JSON.stringify(draft));
        setSaveStep(5);
      }, 1200);
    }, 3000);
  }

  function resetDefaults() {
    if (window.confirm("Which emotional era counts as the default? We chose 'before the open house'. Continue?")) {
      setDraft(DEFAULT_DRAFT);
      setSelectedAvatar("");
      setAvatarConfirmed(false);
      setAlignment("");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className={`${styles.main} ${styles[avatar?.theme ?? "beige"]}`}>
        <div className={styles.alertTape} aria-hidden="true">ACCOUNT SETTINGS • DO NOT PANIC • THE CARPET REMEMBERS • 67 • ACCOUNT SETTINGS</div>

        {!verified && (
          <section className={styles.verification} aria-labelledby="verify-title">
            <div>
              <p className={styles.eyebrow}>PROBABLY YOU™ IDENTITY SYSTEM</p>
              <h1 id="verify-title">Prove you are not three real-estate agents in a trench coat</h1>
              <p>This is a parody gate, not actual authentication. Your dignity remains local to this browser.</p>
            </div>
            <label>Favorite brainrot character
              <select defaultValue=""><option value="" disabled>Choose your legal representative</option>{AVATARS.map((item) => <option key={item.id}>{item.name}</option>)}</select>
            </label>
            <label>Favorite number (there is one correct opinion)
              <input inputMode="numeric" value={favoriteNumber} onChange={(event) => setFavoriteNumber(event.target.value)} placeholder="Definitely not 66" />
            </label>
            <label className={styles.checkRow}><input type="checkbox" checked={notAgents} onChange={(event) => setNotAgents(event.target.checked)} /> I am not three real-estate agents in a trench coat.</label>
            {verificationError && <p className={styles.error} role="alert">{verificationError}</p>}
            <button className={styles.primaryButton} onClick={verifyIdentity}>Calculate My Suspicion Score</button>
            <button className={styles.textButton} onClick={() => { setVerified(true); localStorage.setItem("hellow_account_verified", "yes"); }}>Skip parody verification</button>
          </section>
        )}

        {verified && (
          <>
            <section className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>ACCOUNT BUREAUCRACY CENTER</p>
                <h1>Settings, feelings & miscellaneous regrets</h1>
                <p>Your profile is {profileProgress}% complete. Changing anything may lower this number.</p>
              </div>
              <div className={styles.statCluster}>
                <div><b>103%</b><span>emotionally full</span></div>
                <div><b>{curse}%</b><span>account curse</span></div>
                <div><b>{avatar?.housingAura ?? 0}</b><span>housing aura</span></div>
              </div>
              <div className={styles.backwardProgress}><span style={{ width: `${profileProgress}%` }} /></div>
            </section>

            <div className={styles.dashboard}>
              <aside className={styles.sidebar}>
                <label htmlFor="settings-search">Find a setting, coward</label>
                <input id="settings-search" placeholder="Try remembering" onChange={(event) => setSearchReply(event.target.value ? "Have you tried remembering where the setting is?" : "")} />
                {searchReply && <p className={styles.searchReply}>{searchReply}</p>}
                <nav aria-label="Account settings sections">
                  {SECTIONS.map((section, index) => (
                    <button key={section} className={active === section ? styles.activeNav : ""} onClick={() => setActive(section)}>
                      <span>{["🧠", "📣", "🏚️", "🕵️", "🔐", "💸", "🗑️"][index]}</span>{section}
                    </button>
                  ))}
                </nav>
                <button className={styles.secondaryButton} onClick={resetDefaults}>Restore an emotional default</button>
              </aside>

              <section className={styles.panel} aria-live="polite">
                {active === "Profile" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>CHAMPION SELECTION</p><h2>Choose the creature that represents you legally-ish</h2></header>
                    <div className={styles.avatarGrid}>
                      {AVATARS.map((item) => (
                        <button key={item.id} className={`${styles.avatarCard} ${(selectedAvatar || draft.avatarId) === item.id ? styles.avatarSelected : ""}`} onClick={() => { setSelectedAvatar(item.id); setAvatarConfirmed(false); setVoiceLine(item.catchphrase); }} aria-pressed={(selectedAvatar || draft.avatarId) === item.id}>
                          <span className={styles.avatarGlyph} aria-hidden="true">{item.glyph}</span>
                          <b>{item.name}</b><small>{item.rarity} · Aura {item.housingAura}</small>
                        </button>
                      ))}
                    </div>
                    {avatar && (
                      <article className={styles.avatarDossier}>
                        <span className={styles.bigGlyph} aria-hidden="true">{avatar.glyph}</span>
                        <div><p className={styles.eyebrow}>{avatar.rarity} CREATURE</p><h3>{avatar.title}</h3><p>{avatar.biography}</p><p><b>Special ability:</b> {avatar.specialAbility}</p></div>
                      </article>
                    )}
                    <div className={styles.wheelRow}>
                      <button className={styles.wheel} onClick={spinAlignment}>SPIN<br />ALIGNMENT<br />WHEEL</button>
                      <p>{alignment ? <>The wheel has diagnosed you as <b>{alignment}</b>.</> : "The wheel refuses to judge you until spun."}</p>
                    </div>
                    <button className={styles.primaryButton} onClick={confirmAvatar}>THIS CREATURE REPRESENTS ME</button>
                    {avatarConfirmed && <p className={styles.success}>Champion notarized by the Department of Vibes.</p>}
                    <hr />
                    <div className={styles.twoColumns}>
                      <label>Display name<input value={draft.displayName} onChange={(event) => patchDraft({ displayName: event.target.value })} /></label>
                      <label>Username<input value={draft.username} onChange={(event) => patchDraft({ username: event.target.value })} /></label>
                    </div>
                    <label>Account biography<textarea value={draft.bio} onChange={(event) => patchDraft({ bio: event.target.value })} /></label>
                    <label>Visual offense preset<select value={draft.theme} onChange={(event) => patchDraft({ theme: event.target.value })}><option>Greige Despair</option><option>HOA Beige</option><option>Open-House Migraine</option><option>Luxury Mold</option><option>Carpeted Bathroom</option></select></label>
                  </div>
                )}

                {active === "Notifications" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>COMMUNICATION LABYRINTH</p><h2>How often should we interrupt your healing?</h2></header>
                    {Object.entries(draft.notifications).map(([name, enabled]) => (
                      <label className={styles.switchRow} key={name}><span><b>{name}</b><small>{enabled ? "The algorithm is delighted." : "The corporation will remember this."}</small></span><input type="checkbox" checked={enabled} onChange={(event) => patchDraft({ notifications: { ...draft.notifications, [name]: event.target.checked } })} /></label>
                    ))}
                    <label>Notification ambush frequency<select value={draft.frequency} onChange={(event) => patchDraft({ frequency: event.target.value })}><option>Immediately</option><option>Every seven minutes</option><option>Only during important meetings</option><option>At an inconvenient but legally permissible time</option><option>Never, probably</option></select></label>
                    <div className={styles.notificationPreview}><b>LIVE PREVIEW</b><p>🏠 A home outside your budget has developed a breakfast nook.</p></div>
                  </div>
                )}

                {active === "Housing Preferences" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>SCIENTIFIC CALIBRATION</p><h2>Describe the home the economy will not permit</h2></header>
                    <label>Preferred location<input value={draft.location} onChange={(event) => patchDraft({ location: event.target.value })} /></label>
                    <label>Maximum budget: ${draft.maxBudget.toLocaleString()}<input type="range" min="67" max="1000000" step="67" value={draft.maxBudget} onChange={(event) => patchDraft({ maxBudget: Number(event.target.value) })} /></label>
                    <p className={styles.argument}>MIN HANDLE: “Be realistic.” &nbsp; MAX HANDLE: “Manifest harder.”</p>
                    <label>Commute tolerance<select value={draft.commute} onChange={(event) => patchDraft({ commute: event.target.value })}><option>I enjoy arriving</option><option>Podcasts make anything possible</option><option>Time is a social construct</option><option>I will simply live at work</option></select></label>
                    <fieldset><legend>Required amenities, ranked by clicking vibes</legend><div className={styles.chipGrid}>{AMENITIES.map((amenity) => <button type="button" key={amenity} className={draft.amenities.includes(amenity) ? styles.chipSelected : styles.chip} onClick={() => toggleAmenity(amenity)} aria-pressed={draft.amenities.includes(amenity)}>{amenity}</button>)}</div></fieldset>
                    <p className={styles.feedback}>Based on these preferences, have you considered becoming independently wealthy?</p>
                  </div>
                )}

                {active === "Privacy-ish" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>DATA TUBE CONTROL ROOM</p><h2>Choose which opinions the algorithm may develop</h2></header>
                    <label className={styles.switchRow}><span><b>Public profile</b><small>Let strangers admire your suspicious basement preferences.</small></span><input type="checkbox" checked={draft.publicProfile} onChange={(event) => patchDraft({ publicProfile: event.target.checked })} /></label>
                    <label className={styles.switchRow}><span><b>Allow the algorithm to develop opinions about me</b><small>Personalized recommendations, but judgmental.</small></span><input type="checkbox" checked={draft.recommendations} onChange={(event) => patchDraft({ recommendations: event.target.checked })} /></label>
                    <label className={styles.switchRow}><span><b>Location usage</b><small>Used only inside this fake local demo.</small></span><input type="checkbox" checked={draft.locationUsage} onChange={(event) => patchDraft({ locationUsage: event.target.checked })} /></label>
                    <button className={styles.secondaryButton} onClick={() => setVoiceLine("Your dramatic dossier contains zero useful secrets.")}>Download my suspicious dossier</button>
                    <button className={styles.dangerOutline} onClick={() => window.alert("Account deletion would be clear, conventional, and real here. This demo stores no account.")}>Delete account</button>
                  </div>
                )}

                {active === "Login & Security" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>FORTIFIED McMANSION</p><h2>Security, but with load-bearing copy</h2></header>
                    <article className={styles.securityCard}><div><b>Password strength</b><p>Load-bearing</p></div><span>Adding 67 is emotionally strong but cryptographically unimpressive.</span><a href="/signin">Enter the password obstacle course →</a></article>
                    <article className={styles.securityCard}><div><b>Multi-factor authentication</b><p>Not configured</p></div><span>This state is shown plainly because security jokes stop at the label.</span><button className={styles.secondaryButton}>Configure MFA demo</button></article>
                    <article className={styles.securityCard}><div><b>Active session</b><p>Probably this computer</p></div><span>The smart refrigerator denies everything.</span><button className={styles.secondaryButton}>Review session</button></article>
                  </div>
                )}

                {active === "Subscription" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>CURRENT FINANCIAL MISTAKE</p><h2>Hellow Premium Regret</h2></header>
                    <article className={styles.planCard}><span className={styles.bigGlyph}>💸</span><div><h3>$67 every 7 minutes*</h3><p>Includes premium beige, 12% fewer useful controls, and priority emotional damage.</p><small>*Not a real plan. Nothing is charged or collected.</small></div></article>
                    <label>Coupon of no consequence<input placeholder="Try 67OFF" onChange={(event) => setVoiceLine(event.target.value === "67OFF" ? "Coupon accepted. You saved $0.00." : "Coupon inspector remains unconvinced.")} /></label>
                    <button className={styles.dangerButton} onClick={() => { localStorage.setItem("hellow_cancel_open", "yes"); setShowCancel(true); }}>Cancel Subscription</button>
                  </div>
                )}

                {active === "Miscellaneous Regrets" && (
                  <div className={styles.stack}>
                    <header className={styles.sectionHeader}><p className={styles.eyebrow}>DANGER ADJACENT</p><h2>Choose your preferred degree of suffering</h2></header>
                    <label>Chaos level: {draft.chaosLevel === 67 ? "67 — FORBIDDEN CONFIGURATION" : draft.chaosLevel}<input type="range" min="1" max="5" value={Math.min(5, draft.chaosLevel)} onChange={(event) => patchDraft({ chaosLevel: Number(event.target.value) })} /></label>
                    <button className={styles.forbiddenButton} onClick={() => patchDraft({ chaosLevel: 67 })}>BREACH CONTAINMENT: LEVEL 67</button>
                    {draft.chaosLevel === 67 && <div className={styles.breach} role="status"><b>67</b><span>BRAINROT MODE HAS BREACHED CONTAINMENT</span></div>}
                    <details><summary>Advanced</summary><details><summary>More Advanced</summary><p>You found the setting mines. There is nothing here except premium dust.</p></details></details>
                  </div>
                )}
              </section>
            </div>

            <aside className={styles.mascot} aria-live="polite">
              <span aria-hidden="true">{avatar?.glyph ?? "🧌"}</span>
              <div><b>{avatar?.name ?? "Clippy's Landlord Cousin"}</b><p>{voiceLine}</p></div>
              <button onClick={() => setMascotMuted((value) => !value)}>{mascotMuted ? "Unmute captions" : "Mute mascot"}</button>
            </aside>

            <footer className={styles.saveDock}>
              <div><b>{dirty ? `${changeCount} categories are spiritually unsaved` : "Everything is allegedly saved"}</b><span>Drafts survive refreshes in this browser.</span></div>
              <button className={styles.primaryButton} disabled={!dirty || !draft.avatarId} onClick={() => setSaveStep(1)}>{draft.avatarId ? "Save My Questionable Decisions" : "Select a champion before saving"}</button>
            </footer>
          </>
        )}

        {saveStep > 0 && (
          <div className={styles.cancelModal} role="dialog" aria-modal="true" aria-labelledby="save-title">
            <div className={styles.saveCeremony}>
              <p className={styles.eyebrow}>SETTINGS BOSS BATTLE</p>
              <h2 id="save-title">The Homeowners Association blocks your path</h2>
              {saveStep === 1 && <><p>Are these your final preferences?</p><button className={styles.primaryButton} onClick={() => setSaveStep(2)}>Appeal Decision</button><button className={styles.textButton} onClick={() => setSaveStep(0)}>Return to Settings Mines</button></>}
              {saveStep === 2 && <><p>Even the bathroom one?</p><button className={styles.primaryButton} onClick={() => setSaveStep(3)}>Add Unapproved Lawn Ornament</button></>}
              {saveStep === 3 && <><label>Enter the sacred number<input value={saveCode} onChange={(event) => setSaveCode(event.target.value)} /></label>{saveCode && saveCode !== "67" && <p className={styles.error}>The number council says absolutely not.</p>}<button className={styles.holdButton} disabled={saveCode !== "67"} onPointerDown={beginHold} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && beginHold()}>{holding ? "KEEP HOLDING… 3… 2… 1…" : "Hold for three seconds to submit"}</button></>}
              {saveStep === 4 && <div className={styles.processing}><span>🏠</span><p>Consulting your digital landlord…</p><small>Repainting every button beige.</small></div>}
              {saveStep === 5 && <><span className={styles.bigGlyph}>🎊</span><h3>Your account has been configured against all odds.</h3><p>Several settings may now be different.</p><p className={styles.feedback}>Awarded: {alignment || "67-Compatible User"}</p><button className={styles.primaryButton} onClick={() => { setSaveStep(0); setSaveCode(""); }}>Return to Account</button></>}
            </div>
          </div>
        )}

        {showCancel && <CancelSubscriptionFlow onClose={() => { localStorage.removeItem("hellow_cancel_open"); localStorage.removeItem("hellow_cancel_draft"); setShowCancel(false); }} />}
      </main>
    </>
  );
}


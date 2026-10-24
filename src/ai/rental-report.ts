export type SignalSeverity = "low" | "medium" | "high";

export type RentalSignal = {
  label: string;
  evidence: string;
  severity: SignalSeverity;
  confidence: number;
  xPercent: number;
  yPercent: number;
};

export type RentalReport = {
  summary: string;
  hellScore: number;
  visibleSignals: RentalSignal[];
  euphemismTranslations: Array<{ original: string; translation: string }>;
  questionsForLandlord: string[];
};

type DemoListing = {
  id: string;
  street: string;
  rent: number;
  sqft: number;
  finePrint: string;
};

const severities = new Set<SignalSeverity>(["low", "medium", "high"]);

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 360) : fallback;
}

function numberValue(value: unknown, fallback: number, minimum = 0, maximum = 100) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, Math.round(value)))
    : fallback;
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function parseRentalReport(raw: string): RentalReport | null {
  const unfenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    return null;
  }

  const root = objectValue(parsed);
  if (!root) return null;

  const visibleSignals = Array.isArray(root.visibleSignals)
    ? root.visibleSignals.slice(0, 5).flatMap((candidate, index): RentalSignal[] => {
      const signal = objectValue(candidate);
      if (!signal) return [];
      const severity = severities.has(signal.severity as SignalSeverity)
        ? signal.severity as SignalSeverity
        : "medium";
      return [{
        label: stringValue(signal.label, `Concern ${index + 1}`),
        evidence: stringValue(signal.evidence, "Gemma flagged this for a closer look."),
        severity,
        confidence: numberValue(signal.confidence, 60),
        xPercent: numberValue(signal.xPercent, 50, 4, 96),
        yPercent: numberValue(signal.yPercent, 50, 4, 96),
      }];
    })
    : [];

  const euphemismTranslations = Array.isArray(root.euphemismTranslations)
    ? root.euphemismTranslations.slice(0, 4).flatMap((candidate) => {
      const translation = objectValue(candidate);
      if (!translation) return [];
      return [{
        original: stringValue(translation.original, "Listing language"),
        translation: stringValue(translation.translation, "Ask for specifics before applying."),
      }];
    })
    : [];

  const questionsForLandlord = Array.isArray(root.questionsForLandlord)
    ? root.questionsForLandlord
      .filter((question): question is string => typeof question === "string" && Boolean(question.trim()))
      .slice(0, 5)
      .map((question) => question.trim().slice(0, 300))
    : [];

  if (!visibleSignals.length || !questionsForLandlord.length) return null;

  return {
    summary: stringValue(root.summary, "This listing deserves a second look before anyone pays an application fee."),
    hellScore: numberValue(root.hellScore, 66),
    visibleSignals,
    euphemismTranslations,
    questionsForLandlord,
  };
}

export function demoRentalReport(listing: DemoListing): RentalReport {
  const rentPerSquareFoot = listing.sqft ? listing.rent / listing.sqft : 0;
  const seed = [...listing.id].reduce((total, character) => total + character.charCodeAt(0), 0);
  return {
    summary: `${listing.street} has enough ambiguity to justify a tour, a flashlight, and several very specific follow-up questions.`,
    hellScore: Math.min(94, 61 + seed % 27),
    visibleSignals: [
      {
        label: "Single-angle optimism",
        evidence: "The hero image is well staged, but one flattering angle cannot establish the condition of the rest of the home.",
        severity: "medium",
        confidence: 88,
        xPercent: 66,
        yPercent: 34,
      },
      {
        label: "Fine-print fog",
        evidence: listing.finePrint,
        severity: "high",
        confidence: 97,
        xPercent: 24,
        yPercent: 68,
      },
      {
        label: "Price needs context",
        evidence: `$${rentPerSquareFoot.toFixed(2)} per square foot is advertised without utility, fee, or deposit totals.`,
        severity: "low",
        confidence: 92,
        xPercent: 48,
        yPercent: 52,
      },
    ],
    euphemismTranslations: [
      { original: "Available now", translation: "Please ask why it is still available." },
      { original: "Application fee not included", translation: "The first surprise has already been announced." },
    ],
    questionsForLandlord: [
      "Can you provide an itemized total of rent, utilities, deposits, and recurring fees?",
      "Can I see every room and major appliance during an in-person tour?",
      "When were the HVAC, plumbing, roof, and electrical systems last serviced?",
      "Which conditions shown in the photos differ from the unit currently available?",
    ],
  };
}


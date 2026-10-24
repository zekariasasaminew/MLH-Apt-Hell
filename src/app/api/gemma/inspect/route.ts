import { demoRentalReport, parseRentalReport } from "@/ai/rental-report";
import { getListing } from "@/data/listings";

export const runtime = "nodejs";

const DEFAULT_MODEL = "gemma-4-26b-a4b-it";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SYSTEM_PROMPT = `You are Gemma Rental Reality Check, a careful multimodal assistant inside a fictional rental parody called Hellow.
Analyze only the supplied listing photo and listing facts. Surface potential concerns and useful renter questions, but never claim that an image proves mold, structural damage, code violations, crime, or health hazards. Use phrases such as "may," "appears," and "ask about." Every observation must cite visible evidence or supplied listing text.

Return exactly one JSON object with no markdown using this shape:
{
  "summary": "one concise paragraph",
  "hellScore": 0,
  "visibleSignals": [{
    "label": "short label",
    "evidence": "specific visual or textual evidence",
    "severity": "low | medium | high",
    "confidence": 0,
    "xPercent": 50,
    "yPercent": 50
  }],
  "euphemismTranslations": [{ "original": "listing phrase", "translation": "plain-language interpretation" }],
  "questionsForLandlord": ["specific question"]
}

Use 3-5 visibleSignals and 3-5 questions. Coordinates are percentages from the image's top-left and should point near the relevant visual evidence. If a signal comes only from text, use 50, 50. Keep the humor dry, but keep the evidence and renter guidance genuinely useful.`;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

function fallbackResponse(listing: NonNullable<ReturnType<typeof getListing>>, model: string, warning: string) {
  return Response.json({
    report: demoRentalReport(listing),
    source: "demo" as const,
    model,
    warning,
  }, { headers: { "X-Hellow-Gemma-Fallback": "1" } });
}

export async function POST(request: Request) {
  let listingId: string | undefined;
  try {
    const body = await request.json() as { listingId?: unknown };
    listingId = typeof body.listingId === "string" ? body.listingId : undefined;
  } catch {
    return Response.json({ error: "Expected a JSON request body." }, { status: 400 });
  }

  const listing = listingId ? getListing(listingId) : undefined;
  if (!listing) return Response.json({ error: "Unknown listing." }, { status: 404 });

  const model = process.env.GEMMA_MODEL || DEFAULT_MODEL;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackResponse(listing, model, "Live Gemma is not configured, so Hellow used its deterministic demo report.");
  }

  try {
    const imageResponse = await fetch(listing.photo, {
      headers: { Accept: "image/jpeg" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!imageResponse.ok) throw new Error(`Listing image returned ${imageResponse.status}.`);

    const imageBytes = await imageResponse.arrayBuffer();
    if (imageBytes.byteLength > MAX_IMAGE_BYTES) throw new Error("Listing image exceeded the 5 MB analysis limit.");
    const mimeType = imageResponse.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(mimeType)) {
      throw new Error(`Unsupported listing image type: ${mimeType}.`);
    }

    const listingFacts = [
      `Address: ${listing.street}, ${listing.city}, ${listing.state} ${listing.zip}`,
      `Price: $${listing.rent}/month`,
      `Details: ${listing.beds} beds, ${listing.baths} baths, ${listing.sqft} square feet, ${listing.homeType}`,
      `Status: ${listing.status}`,
      `Badge: ${listing.badge || "none"}`,
      `Fine print: ${listing.finePrint}`,
    ].join("\n");

    const gemmaResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType, data: Buffer.from(imageBytes).toString("base64") } },
              { text: `Inspect this fictional listing:\n${listingFacts}` },
            ],
          }],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 1_600,
            thinkingConfig: { thinkingLevel: "minimal" },
          },
        }),
        signal: AbortSignal.timeout(18_000),
      },
    );

    if (!gemmaResponse.ok) throw new Error(`Gemma returned ${gemmaResponse.status}.`);
    const payload = await gemmaResponse.json() as GeminiResponse;
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    const report = text ? parseRentalReport(text) : null;
    if (!report) throw new Error("Gemma returned a report Hellow could not validate.");

    return Response.json({ report, source: "gemma" as const, model });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown Gemma error.";
    console.error("Gemma rental inspection fell back:", reason);
    return fallbackResponse(listing, model, "Live Gemma was unavailable, so Hellow used its deterministic demo report.");
  }
}


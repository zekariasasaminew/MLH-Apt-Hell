import { NextResponse } from "next/server";

const MODEL = "gemma-4-31b-it";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_IMAGE_BYTES = 4_000_000;
const SAMPLE_HOST = "images.unsplash.com";

const PROMPT = `You are "Hellow Spinner", the sleaziest rental-listing copywriter alive, for a parody apartment site.
Look at the apartment photo. Find the real flaws you can actually see (clutter, stains, dim light, cracks, tiny space, dated fixtures, missing furniture, anything odd).
Reply with ONLY a JSON object, no markdown fences, with these keys:
{
  "headline": short listing title, over-the-top positive spin,
  "description": 2 to 3 sentences of realtor copy that euphemizes every flaw you saw,
  "translations": [ { "said": "realtor phrase you used", "meant": "what it really means, from the photo" } ] (3 to 5 items),
  "fees": [ { "name": absurd fake fee, "amount": number in dollars } ] (3 to 4 items, funny and specific to what the photo shows),
  "hellowScore": integer 1 to 100 for how bad the place really looks (100 is worst)
}
Keep it funny and short. Never use em dashes. If the photo is not a room or building, roast whatever it shows as if it were an apartment.`;

type SpinResult = {
  headline: string;
  description: string;
  translations: { said: string; meant: string }[];
  fees: { name: string; amount: number }[];
  hellowScore: number;
};

const FALLBACK: SpinResult = {
  headline: "Cozy, Character-Rich Urban Retreat",
  description:
    "Sun-kissed with abundant natural ambiance, this intimate hideaway rewards guests who appreciate a rustic, lived-in story. Move-in ready for the adventurous.",
  translations: [
    { said: "Cozy", meant: "You can touch every wall from the bed" },
    { said: "Lived-in story", meant: "The previous tenant's stains are staying" },
    { said: "Natural ambiance", meant: "The light switch is a rumor" },
  ],
  fees: [
    { name: "Lease signing ceremony fee", amount: 149 },
    { name: "Ambiance maintenance surcharge", amount: 65 },
    { name: "Pre-move-in nostalgia deposit", amount: 300 },
  ],
  hellowScore: 87,
};

function parseResult(text: string): SpinResult | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const raw = JSON.parse(text.slice(start, end + 1));
    if (typeof raw.headline !== "string" || typeof raw.description !== "string") return null;
    return {
      headline: raw.headline,
      description: raw.description,
      translations: Array.isArray(raw.translations) ? raw.translations.slice(0, 6) : [],
      fees: Array.isArray(raw.fees) ? raw.fees.slice(0, 5) : [],
      hellowScore: Math.max(1, Math.min(100, Math.round(Number(raw.hellowScore) || 90))),
    };
  } catch {
    return null;
  }
}

async function loadSample(url: string): Promise<{ mimeType: string; data: string } | null> {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== SAMPLE_HOST) return null;
  const res = await fetch(parsed);
  if (!res.ok) return null;
  const bytes = Buffer.from(await res.arrayBuffer());
  return { mimeType: res.headers.get("content-type") ?? "image/jpeg", data: bytes.toString("base64") };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body = (await request.json().catch(() => null)) as {
    image?: { mimeType: string; data: string };
    sampleUrl?: string;
  } | null;

  let image = body?.image ?? null;
  if (!image && body?.sampleUrl) image = await loadSample(body.sampleUrl).catch(() => null);
  if (!image || !image.mimeType.startsWith("image/")) {
    return NextResponse.json({ error: "Send a photo first." }, { status: 400 });
  }
  if (image.data.length * 0.75 > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "That photo is too big. Hellow only accepts small disappointments." }, { status: 413 });
  }
  if (!apiKey) console.error("spin: GEMINI_API_KEY is not set");
  if (!apiKey) return NextResponse.json({ ...FALLBACK, model: "offline-fallback" });

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: image.mimeType, data: image.data } }] }],
        generationConfig: { temperature: 1, maxOutputTokens: 4096 },
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) {
      console.error("spin: Gemini API", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ ...FALLBACK, model: "offline-fallback" });
    }
    const json = await res.json();
    const parts: { text?: string; thought?: boolean }[] = json?.candidates?.[0]?.content?.parts ?? [];
    const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    const result = parseResult(text);
    if (!result) console.error("spin: unparseable reply", text.slice(0, 300));
    return NextResponse.json({ ...(result ?? FALLBACK), model: result ? MODEL : "offline-fallback" });
  } catch (error) {
    console.error("spin: request failed", error);
    return NextResponse.json({ ...FALLBACK, model: "offline-fallback" });
  }
}

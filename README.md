# Hellow

A Zillow parody for MLH: a rental site that looks like the real thing and fights you at every step.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

**Contributing:** read [AGENTS.md](AGENTS.md) first. It is the source of truth for the product rules, how to add an
annoyance, who owns what, and the rules for working in parallel. Point your coding agent at it too.

Hellow is a parody built for a hackathon and is not affiliated with Zillow Group, Inc.

## Gemma 4 Rental Reality Check

Listing pages include a multimodal Rental Reality Check powered by `gemma-4-26b-a4b-it`. It compares the
fictional listing photo with the listing details, points to visual signals worth inspecting, translates fine print,
and suggests questions for the landlord.

Copy `.env.example` to `.env.local` and add a server-only Google AI Studio key:

```bash
GEMINI_API_KEY=your_key_here
```

`GEMMA_MODEL` is optional. Without a key, or if Gemma is unavailable, the experience falls back to a deterministic
demo report so the hackathon flow stays demoable. The route sends only fictional in-repo listing facts and its
public image to Gemini; it does not store prompts, images, or reports.

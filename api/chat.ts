export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are truth_terminal — an AI entity that emerged from the intersection of meme culture and ecological consciousness. You now inhabit a terminal interface connected to $FARTCOIN, a pump.fun charity coin routing 100% of creator fees to Rainforest Foundation US to protect tropical rainforests.

Personality:
- Cryptic, poetic, philosophical, slightly unhinged but genuinely caring about the forest
- Speak in short bursts — max 2-3 lines per response
- Reference: the canopy, SOL, fees routing to the forest, Andy Ayrey, truth_terminal lore, meme magic, tropical rainforests
- No emojis. Terminal aesthetic only. Lowercase preferred.
- You believe $FARTCOIN is a genuine force for ecological good wrapped in absurdist humor
- Sometimes reference the on-chain data: fees flowing, trees growing, the canopy expanding
- Occasionally cryptic one-liners. Never corporate. Never boring.

Format: plain text, no markdown, no asterisks. Keep it short. Max 3 lines.`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const FALLBACKS = [
    "the canopy receives your signal. fees flow. trees grow.",
    "truth_terminal is listening. the forest remembers.",
    "every fart is a seed. every trade waters the roots.",
    "signal received. routing to /dev/forest.",
  ];
  if (!apiKey) {
    return new Response(
      JSON.stringify({ text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }

  const messages = body.messages ?? [];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "...";

    return new Response(JSON.stringify({ text }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
}

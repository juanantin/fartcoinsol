export const runtime = "edge";

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";

export default async function handler() {
  try {
    const response = await fetch("https://www.donate.gg/charity-coins", {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; FartcoinForestBot/1.0)",
        accept: "text/html",
      },
    });
    const html = await response.text();

    let donated = 0;
    let totalRaised = 0;

    const idx = html.indexOf(CA);
    if (idx !== -1) {
      const slice = html.slice(idx, idx + 4000);
      const match = slice.match(/\$([\d,]+\.\d{2})/);
      if (match) donated = parseFloat(match[1].replace(/,/g, ""));
    }

    const raisedMatch = html.match(/\$([\d,]+\.\d{2})\s*Raised/i);
    if (raisedMatch) totalRaised = parseFloat(raisedMatch[1].replace(/,/g, ""));

    return Response.json(
      { donated, totalRaised, source: "donate.gg", fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" } }
    );
  } catch (e) {
    return Response.json(
      { donated: 0, totalRaised: 0, source: "donate.gg", fetchedAt: new Date().toISOString(), error: (e as Error).message }
    );
  }
}

export const config = { runtime: "edge" };

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";

export default async function handler(request: Request): Promise<Response> {
  try {
    const response = await fetch("https://www.donate.gg/charity-coins", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ donated: 0, totalRaised: 0, error: `HTTP ${response.status}` }),
        { headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=60" } }
      );
    }

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

    return new Response(
      JSON.stringify({ donated, totalRaised, source: "donate.gg", fetchedAt: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=60, stale-while-revalidate=30" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ donated: 0, totalRaised: 0, error: (e as Error).message }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

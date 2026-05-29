export const config = { runtime: "edge" };

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";

export default async function handler(request: Request): Promise<Response> {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    const response = await fetch("https://www.donate.gg/charity-coins", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ donated: 0, totalRaised: 0, error: `HTTP ${response.status}` }),
        { headers: { ...headers, "Cache-Control": "no-store" } }
      );
    }

    const html = await response.text();
    let donated = 0;
    let totalRaised = 0;

    // Find the FARTCOIN token row by CA and extract the dollar amount near it
    const idx = html.indexOf(CA);
    if (idx !== -1) {
      // Look in a wider window both before and after the CA occurrence
      const start = Math.max(0, idx - 2000);
      const slice = html.slice(start, idx + 4000);
      // Match dollar amounts — take all matches and use the largest (most likely the cumulative donated)
      const matches = [...slice.matchAll(/\$([\d,]+\.\d{2})/g)];
      if (matches.length > 0) {
        const amounts = matches.map((m) => parseFloat(m[1].replace(/,/g, "")));
        donated = Math.max(...amounts);
      }
    }

    // Total raised for the whole charity-coins campaign
    const raisedMatch = html.match(/\$([\d,]+\.\d{2})\s*Raised/i);
    if (raisedMatch) totalRaised = parseFloat(raisedMatch[1].replace(/,/g, ""));

    return new Response(
      JSON.stringify({ donated, totalRaised, source: "donate.gg", fetchedAt: new Date().toISOString() }),
      { headers: { ...headers, "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ donated: 0, totalRaised: 0, error: (e as Error).message }),
      { headers: { ...headers, "Cache-Control": "no-store" } }
    );
  }
}

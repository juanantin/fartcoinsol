export const config = { runtime: "edge" };

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";
const HEADERS = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

async function fetchViaProxy(url: string): Promise<string | null> {
  // Try allorigins.win - uses residential proxy IPs
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
    } catch {}
  }
  return null;
}

function parseHtml(html: string): { donated: number; totalRaised: number } {
  let donated = 0;
  let totalRaised = 0;

  const idx = html.indexOf(CA);
  if (idx !== -1) {
    const start = Math.max(0, idx - 2000);
    const slice = html.slice(start, idx + 4000);
    const matches = [...slice.matchAll(/\$([\d,]+\.\d{2})/g)];
    if (matches.length > 0) {
      const amounts = matches.map((m) => parseFloat(m[1].replace(/,/g, "")));
      donated = Math.max(...amounts);
    }
  }

  const raisedMatch = html.match(/\$([\d,]+\.\d{2})\s*Raised/i);
  if (raisedMatch) totalRaised = parseFloat(raisedMatch[1].replace(/,/g, ""));

  return { donated, totalRaised };
}

export default async function handler(request: Request): Promise<Response> {
  // 1. Try direct fetch (works if Vercel edge IPs are not blocked)
  try {
    const res = await fetch("https://www.donate.gg/charity-coins", {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.5",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const { donated, totalRaised } = parseHtml(html);
      return new Response(
        JSON.stringify({ donated, totalRaised, source: "donate.gg/direct", fetchedAt: new Date().toISOString() }),
        { headers: { ...HEADERS, "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
      );
    }

    const status = res.status;

    // 2. If direct blocked, try via proxy
    const html = await fetchViaProxy("https://www.donate.gg/charity-coins");
    if (html) {
      const { donated, totalRaised } = parseHtml(html);
      return new Response(
        JSON.stringify({ donated, totalRaised, source: "donate.gg/proxy", fetchedAt: new Date().toISOString() }),
        { headers: { ...HEADERS, "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
      );
    }

    return new Response(
      JSON.stringify({ donated: 0, totalRaised: 0, error: `HTTP ${status} and proxy failed` }),
      { headers: { ...HEADERS, "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ donated: 0, totalRaised: 0, error: (e as Error).message }),
      { headers: { ...HEADERS, "Cache-Control": "no-store" } }
    );
  }
}

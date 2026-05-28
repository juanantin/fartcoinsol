import { createServerFn } from "@tanstack/react-start";

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";

export const getDonationTotal = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await fetch("https://www.donate.gg/charity-coins", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; FartcoinForestBot/1.0; +https://lovable.dev)",
        accept: "text/html",
      },
    });
    const html = await res.text();

    // Find the Fartcoin row by locating the CA, then grab the next $amount after it.
    const idx = html.indexOf(CA);
    let donated = 0;
    let totalRaised = 0;

    if (idx !== -1) {
      const slice = html.slice(idx, idx + 4000);
      const match = slice.match(/\$([\d,]+\.\d{2})/);
      if (match) donated = parseFloat(match[1].replace(/,/g, ""));
    }

    const raisedMatch = html.match(/\$([\d,]+\.\d{2})\s*Raised/i);
    if (raisedMatch) totalRaised = parseFloat(raisedMatch[1].replace(/,/g, ""));

    return {
      donated,
      totalRaised,
      source: "donate.gg",
      fetchedAt: new Date().toISOString(),
    };
  } catch (e) {
    return {
      donated: 0,
      totalRaised: 0,
      source: "donate.gg",
      fetchedAt: new Date().toISOString(),
      error: (e as Error).message,
    };
  }
});

export const config = { runtime: "edge" };

const MINT = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";
const FEE_PROGRAM = "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ";
// DonationFeePda Anchor discriminator: sha256("account:DonationFeePda")[0..8]
const DISCRIMINATOR_B58 = "iGzHuqTccwt"; // base58([246,197,96,9,193,30,93,115])

const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.ankr.com/solana",
];

async function rpc(endpoint: string, method: string, params: unknown[]) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return res.json();
}

async function getDonatedSOL(): Promise<number | null> {
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const data = await rpc(endpoint, "getProgramAccounts", [
        FEE_PROGRAM,
        {
          encoding: "base64",
          filters: [
            { memcmp: { offset: 0, bytes: DISCRIMINATOR_B58 } },
            { memcmp: { offset: 42, bytes: MINT } },
          ],
        },
      ]);
      if (data.error) continue;
      let totalLamports = BigInt(0);
      for (const { account } of data.result ?? []) {
        const buf = Uint8Array.from(atob(account.data[0]), (c) => c.charCodeAt(0));
        if (buf.length >= 146) {
          // Read u64 little-endian at offset 138
          const view = new DataView(buf.buffer);
          totalLamports += view.getBigUint64(138, true);
        }
      }
      return Number(totalLamports) / 1e9;
    } catch {}
  }
  return null;
}

async function getSolPrice(): Promise<number | null> {
  // Jupiter v2 price API
  try {
    const res = await fetch(
      "https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
      { headers: { "Accept": "application/json" } }
    );
    const json = await res.json();
    const price = json?.data?.["So11111111111111111111111111111111111111112"]?.price;
    if (price > 0) return Number(price);
  } catch {}
  // Jupiter v1 fallback
  try {
    const res = await fetch(
      "https://price.jup.ag/v4/price?ids=SOL"
    );
    const json = await res.json();
    const price = json?.data?.SOL?.price;
    if (price > 0) return Number(price);
  } catch {}
  // CoinGecko fallback
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const json = await res.json();
    if (json?.solana?.usd > 0) return json.solana.usd;
  } catch {}
  return null;
}

export default async function handler(): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };

  try {
    const [solDonated, solPrice] = await Promise.all([getDonatedSOL(), getSolPrice()]);

    if (solDonated !== null && solPrice) {
      const donated = solDonated * solPrice;
      return new Response(
        JSON.stringify({ donated, solDonated, solPrice, source: "solana-rpc", fetchedAt: new Date().toISOString() }),
        { headers }
      );
    }

    return new Response(
      JSON.stringify({ donated: 0, error: `solDonated=${solDonated} solPrice=${solPrice}` }),
      { headers: { ...headers, "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ donated: 0, error: (e as Error).message }),
      { headers: { ...headers, "Cache-Control": "no-store" } }
    );
  }
}

import { createServerFn } from "@tanstack/react-start";

const MINT = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";
const FEE_PROGRAM = "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ";
const DISCRIMINATOR_B58 = "iGzHuqTccwt";

const RPC_ENDPOINTS = [
  "https://rpc.ankr.com/solana",
  "https://api.mainnet-beta.solana.com",
];

async function rpc(endpoint: string, method: string, params: unknown[]) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return res.json();
}

async function getSolDonated(): Promise<number | null> {
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
  try {
    const res = await fetch(
      "https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112"
    );
    const json = await res.json();
    const price = json?.data?.["So11111111111111111111111111111111111111112"]?.price;
    if (price > 0) return price;
  } catch {}
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const json = await res.json();
    if (json?.solana?.usd > 0) return json.solana.usd;
  } catch {}
  return null;
}

export const getDonationTotal = createServerFn({ method: "GET" }).handler(async () => {
  const [solDonated, solPrice] = await Promise.all([getSolDonated(), getSolPrice()]);

  if (solDonated !== null && solPrice) {
    return {
      donated: solDonated * solPrice,
      solDonated,
      solPrice,
      source: "solana-rpc",
      fetchedAt: new Date().toISOString(),
    };
  }

  return {
    donated: 0,
    solDonated: solDonated ?? 0,
    solPrice: solPrice ?? 0,
    source: "solana-rpc",
    fetchedAt: new Date().toISOString(),
    error: `solDonated=${solDonated} solPrice=${solPrice}`,
  };
});

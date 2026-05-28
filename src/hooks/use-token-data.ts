import { useEffect, useState } from "react";

interface DexPair {
  priceUsd?: string;
  fdv?: number;
  marketCap?: number;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  txns?: { h24?: { buys: number; sells: number } };
  liquidity?: { usd?: number };
}

const CA = "HnXDnwTa68tRhLRZdJkVRLAeYrUkCYgFgDavtwD1pump";

export function useTokenData() {
  const [data, setData] = useState<DexPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function fetchData() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`);
        const json = await res.json();
        const pair = json?.pairs?.[0] as DexPair | undefined;
        if (alive) {
          setData(pair ?? null);
          setLoading(false);
        }
      } catch (e) {
        if (alive) {
          setError((e as Error).message);
          setLoading(false);
        }
      }
    }
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // Pump.fun creator fees on PumpSwap pairs are roughly 0.05% of volume.
  // We use cumulative 24h volume * fee rate as a *live estimate* of fees
  // routed to Rainforest Foundation US.
  const FEE_RATE = 0.0005;
  const donated24h = (data?.volume?.h24 ?? 0) * FEE_RATE;

  return { data, loading, error, donated24h, ca: CA };
}

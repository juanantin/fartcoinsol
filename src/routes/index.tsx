import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTokenData } from "@/hooks/use-token-data";
import { Typewriter } from "@/components/typewriter";
import { CountUp } from "@/components/count-up";

const X_COMMUNITY = "https://x.com/i/communities/1962171664503840873";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "$FARTCOIN // truth_terminal :: rainforest protocol" },
      {
        name: "description",
        content:
          "$FARTCOIN on pump.fun — creator fees routed to Rainforest Foundation US to protect tropical rainforests. A truth terminal continuation.",
      },
      { property: "og:title", content: "$FARTCOIN // rainforest protocol" },
      {
        property: "og:description",
        content: "Every trade plants trees. Creator fees → Rainforest Foundation US.",
      },
    ],
  }),
  component: Index,
});

const ASCII_TREE = String.raw`
            &&& &&  & &&
        && &\/&\|& ()|/ @, &&
        &\/(/&/&||/& /_/)_&/_&
     &() &\/&|()|/&\/ '%" & ()
    &_\_&&_\ |& |&&/&__%_/_& &&
  &&   && & &| &| /& & % ()& /&&
   ()&_---()&\&\|&&-&&--%---()~
       &&     \|||
               |||
               |||
               |||
         , -=-~  .-^- _
`;

// Characters that can flicker to simulate wind in the canopy
const LEAF_CHARS = ["&", "*", "%", "@", "°", "'", "ø", "∂", "ε"];

function TreeAnimation() {
  const base = [
    "            &&& &&  & &&           ",
    "        && &\\/&\\|& ()|/ @, &&      ",
    "        &\\/(/&/&||/& /_/)_&/_&     ",
    "     &() &\\/&|()|/&\\/ '\"% & ()    ",
    "    &_\\_&&_\\ |& |&&/&__%_/_& &&   ",
    "  &&   && & &| &| /& & % ()& /&&   ",
    "   ()&_---()&\\&\\|&&-&&--%---()~   ",
    "       &&     \\|||               ",
    "               |||               ",
    "               |||               ",
    "               |||               ",
    "         , -=-~  .-^- _          ",
  ];

  const [cells, setCells] = useState<Record<string, string>>({});

  useEffect(() => {
    const flicker = () => {
      // pick 2-5 random leaf positions to swap
      const next: Record<string, string> = {};
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const row = Math.floor(Math.random() * 7); // only canopy rows
        const line = base[row];
        // find leaf chars in this row
        const positions: number[] = [];
        for (let c = 0; c < line.length; c++) {
          if ("&@%'".includes(line[c])) positions.push(c);
        }
        if (positions.length === 0) continue;
        const col = positions[Math.floor(Math.random() * positions.length)];
        next[`${row}-${col}`] = LEAF_CHARS[Math.floor(Math.random() * LEAF_CHARS.length)];
      }
      setCells(next);
    };

    const id = setInterval(flicker, 280);
    return () => clearInterval(id);
  }, []);

  return (
    <pre className="overflow-x-auto text-[10px] leading-tight text-leaf md:text-xs glow select-none">
      {base.map((line, row) => (
        <div key={row}>
          {line.split("").map((ch, col) => {
            const key = `${row}-${col}`;
            const replaced = cells[key];
            if (replaced) {
              return (
                <span key={col} style={{ color: "var(--amber)", opacity: 0.85 }}>
                  {replaced}
                </span>
              );
            }
            return ch;
          })}
        </div>
      ))}
    </pre>
  );
}

const ASCII_LOGO = String.raw`
 ███████╗ █████╗ ██████╗ ████████╗ ██████╗ ██████╗ ██╗███╗   ██╗
 ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║████╗  ██║
 █████╗  ███████║██████╔╝   ██║   ██║     ██║   ██║██║██╔██╗ ██║
 ██╔══╝  ██╔══██║██╔══██╗   ██║   ██║     ██║   ██║██║██║╚██╗██║
 ██║     ██║  ██║██║  ██║   ██║   ╚██████╗╚██████╔╝██║██║ ╚████║
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
`;

const FOREST_FRAMES = [
  // frame 0 — base
  [
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&   ",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&  ",
    "&&&&&&&  &&&&&  &&&&&&& &&&&&&& &&&&&&&  &&&&&  &&&&&&& &&&&&&&  &&&&&  &&&&&&&",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&  ",
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&   ",
    "  |||     |||     |||     |||     |||     |||     |||     |||     |||     |||   ",
    "  |||     |||     |||     |||     |||     |||     |||     |||     |||     |||   ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
  // frame 1 — sway right
  [
    "  &&&      &&&     &&&     &&&      &&&     &&&     &&&      &&&     &&&     && ",
    " &&&&&    &&&&    &&&&&   &&&&&    &&&&    &&&&&   &&&&&    &&&&    &&&&&   &&&&",
    "&&&&&&& &&&&&&  &&&&&&& &&&&&&&  &&&&&&  &&&&&&& &&&&&&&  &&&&&&  &&&&&&& &&&&&",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&    &&&&&   &&&& ",
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&      &&&     &&& ",
    "   |||    |||      |||    |||      |||    |||      |||    |||       |||    |||  ",
    "   |||    |||      |||    |||      |||    |||      |||    |||       |||    |||  ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
  // frame 2 — settle
  [
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&   ",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&  ",
    "&&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&& &&&&&&&",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&  ",
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&   ",
    "  |||     |||     |||     |||     |||     |||     |||     |||     |||     |||   ",
    "  |||     |||     |||     |||     |||     |||     |||     |||     |||     |||   ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
  // frame 3 — sway left
  [
    " &&&      &&&     &&&      &&&     &&&     &&&      &&&     &&&     &&&     &&& ",
    "&&&&    &&&&&    &&&&    &&&&&    &&&&    &&&&&    &&&&    &&&&&   &&&&&    &&&&",
    "&&&&&  &&&&&&& &&&&&&  &&&&&&&  &&&&&& &&&&&&& &&&&&&  &&&&&&&  &&&&&& &&&&&&& ",
    " &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&&   &&&&& ",
    "  &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&     &&&  ",
    "  |||    |||      |||    |||      |||    |||      |||    |||      |||    |||   ",
    "  |||    |||      |||    |||      |||    |||      |||    |||      |||    |||   ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
  // frame 4 — wind gust (taller trees)
  [
    " &&&&&&    &&&&     &&&&&&    &&&&     &&&&&&   &&&&     &&&&&&    &&&&    &&&&& ",
    "&&&&&&&  &&&&&&   &&&&&&&  &&&&&&   &&&&&&&  &&&&&&   &&&&&&&   &&&&&&  &&&&&&& ",
    "&&&&&&& &&&&&&& &&&&&&&&& &&&&&&& &&&&&&&&& &&&&&&& &&&&&&&&& &&&&&&& &&&&&&&&&",
    " &&&&&   &&&&&    &&&&&&   &&&&&    &&&&&&   &&&&&    &&&&&&   &&&&&    &&&&&&  ",
    "  &&&     &&&      &&&&     &&&      &&&&     &&&      &&&&     &&&      &&&&  ",
    "   ||      ||       ||       ||       ||       ||       ||       ||       ||   ",
    "   ||      ||       ||       ||       ||       ||       ||       ||       ||   ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
];

function ForestAnimation() {
  const [frame, setFrame] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // irregular wind timing: calm → gust → calm
    const delays = [900, 700, 800, 700, 1200];
    const id = setTimeout(() => {
      setFrame((f) => (f + 1) % FOREST_FRAMES.length);
      setTick((t) => t + 1);
    }, delays[tick % delays.length]);
    return () => clearTimeout(id);
  }, [tick]);

  return (
    <pre className="mt-6 overflow-x-auto text-[8px] leading-tight text-leaf md:text-[10px] glow select-none">
      {FOREST_FRAMES[frame].join("\n")}
    </pre>
  );
}

const BOOT_LINES = [
  "[OK] init kernel — truth_terminal_v3.14",
  "[OK] mount /dev/forest",
  "[OK] handshake :: solana mainnet",
  "[OK] linked: andy_ayrey.signature",
  "[OK] mirror: rainforest_foundation_us",
  "[..] streaming creator fees → canopy_address",
];

function Index() {
  const { data, ca } = useTokenData();
  const { data: donationLive } = useQuery({
    queryKey: ["donation"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/donation");
        if (res.ok) {
          const json = await res.json();
          if (json.donated > 0 || json.totalRaised > 0) return json;
        }
      } catch {}
      try {
        const res = await fetch("/donation.json");
        if (res.ok) return res.json();
      } catch {}
      return { donated: 0, totalRaised: 0 };
    },
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
  const totalDonated = donationLive?.donated ?? 0;
  const [bootStep, setBootStep] = useState(0);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    if (bootStep >= BOOT_LINES.length) {
      setBootDone(true);
      return;
    }
    const id = setTimeout(() => setBootStep((s) => s + 1), 500);
    return () => clearTimeout(id);
  }, [bootStep]);

  const price = data?.priceUsd ? parseFloat(data.priceUsd) : 0;
  const mcap = data?.marketCap ?? data?.fdv ?? 0;
  const vol = data?.volume?.h24 ?? 0;
  const change = data?.priceChange?.h24 ?? 0;
  const buys = data?.txns?.h24?.buys ?? 0;
  const sells = data?.txns?.h24?.sells ?? 0;
  const liquidity = data?.liquidity?.usd ?? 0;

  const treesEstimate = totalDonated * 10;

  const copyCA = () => {
    navigator.clipboard.writeText(ca);
  };

  return (
    <main className="crt min-h-screen px-4 py-6 md:px-10 md:py-10">
      {/* Ticker */}
      <div className="terminal-box mb-6 overflow-hidden rounded-md">
        <div className="flex whitespace-nowrap ticker-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex shrink-0 gap-8 px-4 py-2 text-xs text-terminal-dim">
              <span>◉ LIVE</span>
              <span>$FARTCOIN ── ${price.toFixed(8)}</span>
              <span>
                24H{" "}
                <span style={{ color: change >= 0 ? "var(--leaf)" : "var(--danger)" }}>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)}%
                </span>
              </span>
              <span>MCAP ${formatShort(mcap)}</span>
              <span>VOL ${formatShort(vol)}</span>
              <span className="glow-amber" style={{ color: "var(--amber)" }}>
                [+] TOTAL DONATED ≈ ${totalDonated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span>RAINFOREST FOUNDATION US</span>
              <span>──────</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ASCII LOGO */}
        <header className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-terminal-dim">
            <span>truth_terminal:/usr/forest$ cat /boot/identity</span>
            <span className="inline-flex items-center gap-2 rounded-sm border border-border px-2 py-1">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--leaf)" }} />
              solana_mainnet :: online
            </span>
          </div>
          <pre className="glow overflow-x-auto text-[6px] leading-[1.05] text-terminal sm:text-[8px] md:text-[12px] lg:text-[14px]">
{ASCII_LOGO}
          </pre>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs uppercase tracking-[0.3em] text-terminal-dim md:text-sm">
            <span>:: rainforest_protocol</span>
            <span>::</span>
            <span>creator_fees → trees</span>
          </div>
        </header>

        {/* Boot sequence */}
        <section className="terminal-box mb-8 rounded-md p-4 md:p-6 scan-line">
          <div className="mb-3 flex items-center gap-2 text-xs text-terminal-dim">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--danger)" }} />
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--amber)" }} />
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--leaf)" }} />
            <span className="ml-2">truth_terminal --- /dev/forest --- 80x24</span>
          </div>
          <TreeAnimation />
          <div className="mt-3 space-y-1 text-xs md:text-sm">
            {BOOT_LINES.slice(0, bootStep).map((l, i) => (
              <div key={i} className="text-terminal">
                <Typewriter text={l} speed={10} />
              </div>
            ))}
            {bootDone && (
              <div className="text-terminal">
                truth_terminal:/$ <span className="blink">|</span>
              </div>
            )}
          </div>
        </section>

        {/* Donation hero */}
        <section className="terminal-box mb-8 rounded-md p-6 md:p-10 text-center scan-line">
          <div className="text-xs uppercase tracking-[0.4em] text-terminal-dim md:text-sm">
            // total_fees_routed_to_rainforest_foundation_us
          </div>
          <div
            className="glow-amber mt-4 font-bold leading-none break-words"
            style={{
              color: "var(--amber)",
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {donationLive === undefined ? (
              <span className="text-terminal-dim">$--.--</span>
            ) : (
              <CountUp value={totalDonated} decimals={2} prefix="$" />
            )}
          </div>
          {donationLive?.solDonated != null && (
            <div className="mt-2 text-sm text-terminal-dim md:text-base">
              <span style={{ color: "var(--leaf)" }}>
                <CountUp value={donationLive.solDonated} decimals={3} suffix=" SOL" />
              </span>
              <span className="mx-2 opacity-40">//</span>
              <span className="opacity-60">~${totalDonated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD est.</span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-terminal-dim md:text-base">
            <span>
              {">"} <CountUp value={treesEstimate} decimals={0} /> saplings_funded
            </span>
            <span className="hidden md:inline">::</span>
            <span>
              {">"}{" "}
              <a
                href="https://www.donate.gg/charity-coins"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-4 hover:text-leaf"
              >
                verify on donate.gg
              </a>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-terminal-dim">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--amber)" }} />
            live · donate.gg
          </div>
          <div className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-terminal md:text-sm">
            creator fees from $FARTCOIN trades on pump.fun are forwarded to{" "}
            <a
              href="https://rainforestfoundation.org/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-4 hover:text-leaf"
            >
              Rainforest Foundation US
            </a>
            , the same nonprofit andy ayrey chose when he redirected fees from the
            original Fartcoin pair — protecting tropical rainforests across central
            and south america.
          </div>
          <ForestAnimation />
        </section>

        {/* Stats grid — 2 columns */}
        <section className="mb-8 grid grid-cols-2 gap-4">
          <StatCard label="price_usd" value={`$${price > 0 ? price.toFixed(price < 0.01 ? 8 : 4) : "--"}`} />
          <StatCard
            label="24h_change"
            value={`${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
            tone={change >= 0 ? "good" : "bad"}
          />
          <StatCard label="market_cap" value={`$${formatShort(mcap)}`} />
          <StatCard label="24h_volume" value={`$${formatShort(vol)}`} />
          <StatCard label="liquidity" value={`$${formatShort(liquidity)}`} />
          <StatCard label="buys_24h" value={buys.toLocaleString()} tone="good" />
          <StatCard label="sells_24h" value={sells.toLocaleString()} tone="bad" />
          <StatCard label="fee_rate" value="0.05% → 🌳" tone="amber" />
        </section>

        {/* Lore */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <article className="terminal-box rounded-md p-5">
            <div className="text-xs text-terminal-dim">// the_lore.log</div>
            <h3 className="mt-2 text-lg glow text-terminal">a meme that breathes oxygen</h3>
            <p className="mt-3 text-sm leading-relaxed text-terminal">
              in 2024, an LLM whispered into the void and a coin was born. when andy
              ayrey, the architect of truth_terminal, claimed the creator fees from
              the original fartcoin liquidity pair, he didn&apos;t pocket them. he
              redirected the entire stream to Rainforest Foundation US.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-terminal-dim">
              this token continues that lineage on pump.fun — same ethos, same
              foundation, same canopy.
            </p>
          </article>
          <article className="terminal-box rounded-md p-5">
            <div className="text-xs text-terminal-dim">// the_mechanism.sh</div>
            <h3 className="mt-2 text-lg glow text-terminal">how the fee → forest pipe works</h3>
            <ul className="mt-3 space-y-2 text-sm text-terminal">
              <li>
                <span style={{ color: "var(--amber)" }}>$</span> you trade $FARTCOIN on pump.fun
              </li>
              <li>
                <span style={{ color: "var(--amber)" }}>$</span> pump.fun pair generates creator_fees (~0.05%)
              </li>
              <li>
                <span style={{ color: "var(--amber)" }}>$</span> fees are claimed and routed to Rainforest Foundation US
              </li>
              <li>
                <span style={{ color: "var(--amber)" }}>$</span> the rainforest gets bigger. your bag, possibly, too.
              </li>
            </ul>
          </article>
        </section>

        {/* CA + Buy */}
        <section className="terminal-box mb-8 rounded-md p-4 md:p-6">
          <div className="text-xs uppercase tracking-widest text-terminal-dim">contract_address</div>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <code className="break-all text-sm text-terminal glow md:text-base">{ca}</code>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyCA}
                className="rounded-sm border border-border px-3 py-2 text-xs text-terminal transition hover:bg-terminal hover:text-background"
              >
                [ copy_ca ]
              </button>
              <a
                href={`https://pump.fun/coin/${ca}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-amber px-3 py-2 text-xs glow-amber transition hover:bg-amber hover:text-background"
                style={{ color: "var(--amber)", borderColor: "var(--amber)" }}
              >
                [ buy_on_pump.fun → ]
              </a>
              <a
                href={`https://dexscreener.com/solana/${ca}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border px-3 py-2 text-xs text-terminal transition hover:bg-terminal hover:text-background"
              >
                [ chart ]
              </a>
              <a
                href={X_COMMUNITY}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-leaf px-3 py-2 text-xs transition hover:bg-leaf hover:text-background"
                style={{ color: "var(--leaf)", borderColor: "var(--leaf)" }}
              >
                [ x_community ]
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-terminal-dim">
          <div>truth_terminal :: rainforest_protocol :: not financial advice. memes only.</div>
          <div className="mt-1">
            donation totals sourced live from{" "}
            <a className="underline decoration-dotted underline-offset-4 hover:text-terminal" href="https://www.donate.gg/charity-coins" target="_blank" rel="noreferrer">
              donate.gg/charity-coins
            </a>.
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-4">
            <a className="hover:text-terminal" href={`https://pump.fun/coin/${ca}`} target="_blank" rel="noreferrer">
              pump.fun
            </a>
            <a className="hover:text-terminal" href={X_COMMUNITY} target="_blank" rel="noreferrer">
              x_community
            </a>
            <a className="hover:text-terminal" href="https://rainforestfoundation.org/" target="_blank" rel="noreferrer">
              rainforest_foundation_us
            </a>
            <a className="hover:text-terminal" href="https://x.com/AndyAyrey" target="_blank" rel="noreferrer">
              @andyayrey
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "bad" | "amber";
}) {
  const color =
    tone === "good"
      ? "var(--leaf)"
      : tone === "bad"
        ? "var(--danger)"
        : tone === "amber"
          ? "var(--amber)"
          : "var(--terminal)";
  return (
    <div className="terminal-box rounded-md p-4 md:p-6">
      <div className="text-[10px] uppercase tracking-widest text-terminal-dim">{label}</div>
      <div className="mt-2 text-lg font-bold md:text-xl glow" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function formatShort(n: number): string {
  if (!n || isNaN(n)) return "--";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}

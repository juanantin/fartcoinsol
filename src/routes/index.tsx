import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTokenData } from "@/hooks/use-token-data";
import { supabase } from "@/lib/supabase";
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

const BURST_CHARS = ["💨", "*", "~", "°", "ε", "ø", "§", "¥", "∞", "ξ", "#"];

function TreeAnimation({ burst = false }: { burst?: boolean }) {
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
    if (burst) {
      // Wild burst: replace ALL leaf chars rapidly
      let t = 0;
      const burstInterval = setInterval(() => {
        const next: Record<string, string> = {};
        for (let row = 0; row < 7; row++) {
          const line = base[row];
          for (let col = 0; col < line.length; col++) {
            if ("&@%'()_-~".includes(line[col]) && Math.random() > 0.3) {
              next[`${row}-${col}`] = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
            }
          }
        }
        setCells(next);
        t++;
        if (t > 6) clearInterval(burstInterval);
      }, 80);
      return () => clearInterval(burstInterval);
    }

    const flicker = () => {
      const next: Record<string, string> = {};
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const row = Math.floor(Math.random() * 7);
        const line = base[row];
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
  }, [burst]);

  return (
    <pre className="overflow-x-auto text-[10px] leading-tight text-leaf md:text-xs glow select-none">
      {base.map((line, row) => (
        <div key={row}>
          {line.split("").map((ch, col) => {
            const key = `${row}-${col}`;
            const replaced = cells[key];
            if (replaced) {
              return (
                <span
                  key={col}
                  style={{ color: burst ? "var(--amber)" : "var(--amber)", opacity: burst ? 1 : 0.85 }}
                >
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

// Tree templates — 8 rows each, fixed width 9 chars
const TREE_TEMPLATES: Record<string, string[]> = {
  sapling: [
    "   ↑   ",
    "  /|\\  ",
    " //|\\\\ ",
    "   |   ",
    "   |   ",
    "   |   ",
    "       ",
    "~~~~~~~",
  ],
  medium: [
    "  &&&  ",
    " &&&&& ",
    "&&&&&&&",
    " &&&&& ",
    "  |||  ",
    "  |||  ",
    "       ",
    "~~~~~~~",
  ],
  tall: [
    " &&&&& ",
    "&&&&&&&",
    "&&&&&&&&",
    " &&&&& ",
    "  &&&  ",
    "  |||  ",
    "  |||  ",
    "~~~~~~~",
  ],
  ancient: [
    " &&&&&&& ",
    "&&&&&&&&&",
    "&&&&&&&&&",
    " %%%%%%% ",
    "  &&&&&  ",
    "   |||   ",
    "   |||   ",
    "~~~~~~~~~",
  ],
};

const TREES_PER_ROW = 20;

// Deterministic species mix per tree index based on donation level
function speciesForTree(treeIdx: number, donated: number): string {
  const unlocked = donated >= 15000 ? ["sapling", "medium", "tall", "ancient"] :
                   donated >= 8000  ? ["sapling", "medium", "tall"] :
                   donated >= 3000  ? ["sapling", "medium"] :
                                      ["sapling"];
  // Use a fixed pattern so trees don't change on re-render
  const patterns = [0, 1, 0, 2, 1, 0, 3, 1, 2, 0, 1, 3, 0, 2, 1, 0, 3, 2, 1, 0];
  const idx = patterns[treeIdx % patterns.length] % unlocked.length;
  return unlocked[idx];
}

function ForestAnimation({ donated }: { donated: number }) {
  const totalTrees = Math.max(3, Math.floor(donated / 1000));

  // How many full rows + remainder
  const fullRows = Math.floor(totalTrees / TREES_PER_ROW);
  const remainder = totalTrees % TREES_PER_ROW;
  const rowCounts = [
    ...Array.from({ length: fullRows }, () => TREES_PER_ROW),
    ...(remainder > 0 ? [remainder] : []),
  ];

  const [cells, setCells] = useState<Record<string, string>>({});

  useEffect(() => {
    const id = setInterval(() => {
      const next: Record<string, string> = {};
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const rowGroupIdx = Math.floor(Math.random() * rowCounts.length);
        const treeCol = Math.floor(Math.random() * rowCounts[rowGroupIdx]);
        const globalIdx = rowGroupIdx * TREES_PER_ROW + treeCol;
        const tpl = TREE_TEMPLATES[speciesForTree(globalIdx, donated)];
        const treeRow = Math.floor(Math.random() * 4);
        const line = tpl[treeRow];
        const leafPositions: number[] = [];
        for (let c = 0; c < line.length; c++) {
          if ("&%".includes(line[c])) leafPositions.push(c);
        }
        if (!leafPositions.length) continue;
        const lc = leafPositions[Math.floor(Math.random() * leafPositions.length)];
        next[`${rowGroupIdx}-${treeRow}-${treeCol}-${lc}`] = LEAF_CHARS[Math.floor(Math.random() * LEAF_CHARS.length)];
      }
      setCells(next);
    }, 350);
    return () => clearInterval(id);
  }, [totalTrees, donated]);

  return (
    <div className="mt-6 overflow-x-auto">
      <pre className="text-[8px] leading-tight text-leaf md:text-[10px] glow select-none inline-block">
        {rowCounts.map((count, rowGroupIdx) => {
          const isFront = rowGroupIdx === rowCounts.length - 1;
          const opacity = isFront ? 1 : Math.max(0.35, 1 - rowGroupIdx * 0.2);

          // Each tree in this row group can be a different species
          const treeLines = Array.from({ length: count }, (_, col) => {
            const globalIdx = rowGroupIdx * TREES_PER_ROW + col;
            const sp = speciesForTree(globalIdx, donated);
            const tpl = isFront ? TREE_TEMPLATES[sp] : TREE_TEMPLATES[sp].slice(0, 3);
            return tpl;
          });

          const numRows = isFront ? 8 : 3;

          return (
            <div key={rowGroupIdx} style={{ opacity }}>
              {Array.from({ length: numRows }, (_, row) => {
                // Build this row by joining each tree's line
                const parts = treeLines.map((tpl, col) => {
                  const line = (tpl[row] ?? "       ").split("");
                  return line.map((ch, c) => {
                    const key = `${rowGroupIdx}-${row}-${col}-${c}`;
                    return cells[key] ?? ch;
                  });
                });

                // Flatten with space separator between trees
                const chars: React.ReactNode[] = [];
                parts.forEach((tree, col) => {
                  if (col > 0) chars.push(" ");
                  tree.forEach((ch, c) => {
                    const isFlicker = !"&%~|/ \\↑ ".includes(ch as string);
                    chars.push(isFlicker
                      ? <span key={`${col}-${c}`} style={{ color: "var(--amber)" }}>{ch}</span>
                      : ch
                    );
                  });
                });

                return <div key={row}>{chars}</div>;
              })}
            </div>
          );
        }).reverse()}
      </pre>
      <div className="mt-1 text-[9px] text-terminal-dim">
        {totalTrees} trees · ${Math.floor(donated).toLocaleString()} donated
        {totalTrees < TREES_PER_ROW && ` · next at $${(Math.ceil((donated + 1) / 1000) * 1000).toLocaleString()}`}
        {totalTrees >= TREES_PER_ROW && ` · row ${Math.ceil(totalTrees / TREES_PER_ROW)} of forest`}
      </div>
    </div>
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

type Message = { role: "user" | "assistant"; content: string };

const OPENING_PROMPTS = [
  "tell me about yourself",
  "what is this place",
  "why fartcoin",
  "speak",
];

function TerminalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Opening transmission from Truth Terminal
    const prompt = OPENING_PROMPTS[Math.floor(Math.random() * OPENING_PROMPTS.length)];
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
    })
      .then((r) => r.json())
      .then((d) => {
        setMessages([{ role: "assistant", content: d.text }]);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIdx = useRef(-1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    historyRef.current = [text, ...historyRef.current];
    historyIdx.current = -1;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "signal lost." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="mt-2 text-xs md:text-sm">
      {/* Message history */}
      <div ref={scrollRef} className="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-terminal-dim" : "text-terminal"}>
            {m.role === "assistant" ? (
              <><span style={{ color: "var(--leaf)" }}>truth_terminal</span>
              <span className="text-terminal-dim">:/$ </span>
              {i === messages.length - 1
                ? <Typewriter text={m.content} speed={18} />
                : m.content}
              </>
            ) : (
              <><span className="text-terminal-dim">you:/$ </span>{m.content}</>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-terminal">
            <span style={{ color: "var(--leaf)" }}>truth_terminal</span>
            <span className="text-terminal-dim">:/$ </span>
            <span className="blink">_</span>
          </div>
        )}
      </div>

      {/* Input */}
      {ready && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-terminal-dim shrink-0">you:/$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); send(); }
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                const h = historyRef.current;
                if (!h.length) return;
                const idx = Math.min(historyIdx.current + 1, h.length - 1);
                historyIdx.current = idx;
                setInput(h[idx]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const idx = historyIdx.current - 1;
                historyIdx.current = idx;
                setInput(idx < 0 ? "" : historyRef.current[idx]);
              }
            }}
            placeholder="type a transmission..."
            disabled={loading}
            className="flex-1 bg-transparent text-terminal outline-none placeholder:text-terminal-dim/40 caret-leaf"
            style={{ fontFamily: "inherit" }}
          />
        </div>
      )}
    </div>
  );
}

function FartButton({ onBurst }: { onBurst: () => void }) {
  const [count, setCount] = useState<number | null>(null);
  const [pressing, setPressing] = useState(false);
  const [gas, setGas] = useState<{ id: number; x: number }[]>([]);
  let gasId = 0;

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("fart_counter")
      .select("count")
      .eq("id", "global")
      .single()
      .then(({ data }) => {
        if (data) setCount(data.count);
      });

    const channel = supabase
      .channel("fart_counter")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "fart_counter" }, (payload) => {
        setCount(payload.new.count);
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  const handleFart = async () => {
    if (pressing) return;
    setPressing(true);
    onBurst();

    // Float gas particles
    const newGas = Array.from({ length: 5 }, (_, i) => ({
      id: gasId++,
      x: 30 + Math.random() * 40,
    }));
    setGas((g) => [...g, ...newGas]);
    setTimeout(() => setGas((g) => g.filter((p) => !newGas.find((n) => n.id === p.id))), 1400);

    // Increment in Supabase
    if (supabase) {
      const { error } = await supabase.rpc("increment_farts");
      if (error) console.error("[fart] rpc error:", error);
      else {
        // Also manually refresh count in case realtime is slow
        const { data } = await supabase.from("fart_counter").select("count").eq("id", "global").single();
        if (data) setCount(data.count);
      }
    }

    setTimeout(() => setPressing(false), 600);
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      {/* Floating gas particles */}
      <div className="relative h-8 w-full overflow-hidden">
        {gas.map((p) => (
          <span
            key={p.id}
            className="absolute text-xs animate-rise"
            style={{ left: `${p.x}%`, color: "var(--amber)", animationDuration: "1.2s" }}
          >
            💨
          </span>
        ))}
      </div>

      <button
        onClick={handleFart}
        disabled={pressing}
        className="terminal-box rounded px-8 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all select-none"
        style={{
          color: pressing ? "var(--amber)" : "var(--leaf)",
          borderColor: pressing ? "var(--amber)" : undefined,
          textShadow: pressing ? "0 0 12px var(--amber)" : undefined,
          cursor: pressing ? "default" : "pointer",
        }}
      >
        {pressing ? "💨 FART TRANSMITTED 💨" : "[> FART THE TREE <]"}
      </button>

      <div className="text-xs text-terminal-dim">
        {count === null
          ? "connecting to canopy..."
          : <><span style={{ color: "var(--amber)" }} className="glow-amber">{count.toLocaleString()}</span> farts transmitted to the canopy</>
        }
      </div>
    </div>
  );
}

function Index() {
  const { data, ca } = useTokenData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
  const [burst, setBurst] = useState(false);
  const [bootStep, setBootStep] = useState(() =>
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("booted") ? BOOT_LINES.length : 0
  );
  const [bootDone, setBootDone] = useState(() =>
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("booted") === "1"
  );

  useEffect(() => {
    if (bootStep >= BOOT_LINES.length) {
      setBootDone(true);
      sessionStorage.setItem("booted", "1");
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
        <section className="terminal-box mb-8 rounded-md p-4 md:p-6">
          <div className="mb-3 flex items-center gap-2 text-xs text-terminal-dim">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--danger)" }} />
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--amber)" }} />
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--leaf)" }} />
            <span className="ml-2">truth_terminal --- /dev/forest --- 80x24</span>
          </div>
          <TreeAnimation burst={burst} />
          <FartButton onBurst={() => {
            setBurst(true);
            setTimeout(() => setBurst(false), 700);
          }} />
          <div className="mt-3 space-y-1 text-xs md:text-sm">
            {BOOT_LINES.slice(0, bootStep).map((l, i) => (
              <div key={i} className="text-terminal">
                <Typewriter text={l} speed={10} />
              </div>
            ))}
            {bootDone && <TerminalChat />}
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
          <ForestAnimation donated={totalDonated} />
        </section>

        {/* Stats grid — 2 columns */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-lg font-bold glow-amber tracking-widest" style={{ color: "var(--amber)" }}>$FARTCOIN</span>
            <span className="text-xs text-terminal-dim tracking-widest uppercase">// token_metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
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

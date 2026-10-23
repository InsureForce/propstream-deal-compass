import { useState } from "react";
import { FileText, Loader2, Send, Sparkles, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, inputCls, PageHeader } from "./ui";

type Msg = { me: boolean; t?: string; memo?: boolean };
const STEPS = ["Pulling rent roll & lease abstract…", "Analyzing 1,284 Sun Belt QSR comps…", "Drafting investment highlights…"];

function Memo() {
  const comps = [
    ["Starbucks — McKinney, TX", "Jun 2026", "$2,980,000", "5.25%"],
    ["Starbucks — Allen, TX", "Apr 2026", "$3,410,000", "5.10%"],
    ["Starbucks — Denton, TX", "Feb 2026", "$2,725,000", "5.55%"],
    ["Starbucks — Prosper, TX", "Nov 2025", "$3,295,000", "5.30%"],
  ];
  return (
    <div className="fade-up w-full max-w-3xl overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/40 px-6 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Confidential Investment Teaser</div>
        <h3 className="mt-1 font-display text-3xl leading-tight">Starbucks Drive-Thru — Frisco, Texas</h3>
        <p className="text-xs text-muted-foreground">8950 Preston Rd · Frisco, TX 75034 · Dallas–Fort Worth MSA</p>
      </div>
      <div className="grid grid-cols-4 divide-x border-b text-center">
        {[["Offering Price", "$3,150,000"], ["Cap Rate", "5.35%"], ["NOI", "$168,525"], ["Lease Term", "10 Yrs NNN"]].map(([k, v]) => (
          <div key={k} className="px-3 py-3"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div><div className="font-mono text-sm font-semibold">{v}</div></div>
        ))}
      </div>
      <div className="space-y-5 px-6 py-5 text-sm leading-relaxed">
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Investment Highlights</h4>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-brand">
            <li>Corporate-guaranteed lease by Starbucks Corporation (NASDAQ: SBUX, S&P BBB+)</li>
            <li>Absolute NNN — zero landlord responsibilities; tenant covers taxes, insurance, CAM, roof & structure</li>
            <li>10% rental escalations every 5 years plus four 5-year renewal options</li>
            <li>2025 construction with dual-lane drive-thru on a 0.92-acre hard-corner outparcel</li>
            <li>Frisco is among the fastest-growing US cities: 142,000 residents within 3 miles, $134,600 avg. HH income</li>
            <li>Adjacent to The Star (Dallas Cowboys HQ) and PGA of America headquarters; 48,000 VPD on Preston Rd</li>
          </ul>
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Market Cap Rate Comps</h4>
          <table className="w-full text-xs">
            <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="py-1.5 font-medium">Property</th><th className="font-medium">Sold</th><th className="font-medium">Price</th><th className="text-right font-medium">Cap</th></tr></thead>
            <tbody className="divide-y font-mono">
              {comps.map((c) => <tr key={c[0]}><td className="py-1.5 font-sans">{c[0]}</td><td>{c[1]}</td><td>{c[2]}</td><td className="text-right">{c[3]}</td></tr>)}
              <tr className="font-semibold"><td className="py-1.5 font-sans">Comp average</td><td /><td>$3,102,500</td><td className="text-right">5.30%</td></tr>
            </tbody>
          </table>
        </section>
        <p className="rounded-md border-l-2 border-brand bg-brand/5 px-4 py-3 text-xs">
          <strong>Pricing thesis:</strong> At 5.35%, the subject is priced 5 bps wide of the trailing-12 DFW Starbucks average despite newer vintage and superior demographics — a compelling entry for 1031 buyers seeking passive, investment-grade income.
        </p>
      </div>
    </div>
  );
}

export function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([{ me: false, t: "Good evening. I'm your PropStream Copilot — I can draft offering memos, pull cap-rate comps, and match 1031 buyers to listings." }]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (loading) return;
    setMsgs((m) => [...m, { me: true, t: "Generate a property marketing memo for Starbucks — Frisco, TX" }]);
    setLoading(true); setStep(0);
    STEPS.forEach((_, i) => setTimeout(() => setStep(i), i * 700));
    setTimeout(() => { setLoading(false); setMsgs((m) => [...m, { me: false, memo: true }]); }, 2200);
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault(); if (!q.trim()) return;
    setMsgs((m) => [...m, { me: true, t: q }, { me: false, t: "Based on trailing-12 Sun Belt data, investment-grade net-lease cap rates have expanded ~35 bps YoY, with QSR ground leases holding firmest near 4.50%. Want me to draft a memo for one of your listings?" }]);
    setQ("");
  };

  return (
    <>
      <PageHeader eyebrow="Intelligence" title="AI Copilot" sub="Grounded in your firm's deal history and national comp data."
        right={<button onClick={generate} disabled={loading} className="flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 transition hover:opacity-90 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Generate Property Marketing Memo
        </button>} />
      <Card className="flex h-[680px] flex-col">
        <div className="flex items-center gap-2 border-b px-5 py-3 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success" /> Copilot online · Context: Meridian CRE · 2,400 closed transactions
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {msgs.map((m, i) => m.memo ? (
            <div key={i} className="space-y-2">
              <Memo />
              <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy memo"}
              </button>
            </div>
          ) : (
            <div key={i} className={cn("fade-up max-w-2xl rounded-lg px-4 py-3 text-sm leading-relaxed", m.me ? "ml-auto bg-primary text-primary-foreground" : "border bg-muted/40")}>
              {!m.me && <Sparkles className="mb-1 h-3.5 w-3.5 text-brand" />}{m.t}
            </div>
          ))}
          {loading && (
            <div className="fade-up flex max-w-md items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-brand" /><span className="text-muted-foreground">{STEPS[step]}</span>
            </div>
          )}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t p-4">
          <input className={inputCls} placeholder="Ask about a deal, tenant, or market…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button aria-label="Send" className="grid w-11 place-items-center rounded-md bg-brand text-brand-foreground"><Send className="h-4 w-4" /></button>
        </form>
      </Card>
    </>
  );
}

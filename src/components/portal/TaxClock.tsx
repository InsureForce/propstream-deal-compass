import { useState } from "react";
import { AlertTriangle, CalendarClock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysBetween, fmtM, fmtUSD, TODAY } from "./data";
import { exchangeStatus, TAX_WINDOWS } from "./billing";
import { Card, CardHeader, Field, inputCls, PageHeader, Stat } from "./ui";
import { DollarSign, Timer } from "lucide-react";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => { const d = new Date(s); d.setDate(d.getDate() + n); return d; };
const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

type Row = { client: string; property: string; proceeds: number; closing: string; broker: string };
const SEED: Row[] = [
  { client: "Henderson Family Trust", property: "Retail Strip — Plano, TX", proceeds: 4_200_000, closing: iso(addDays(iso(TODAY), -38)), broker: "Marcus Delgado" },
  { client: "Lindqvist Revocable Trust", property: "Flex Industrial — Matthews, NC", proceeds: 3_375_000, closing: iso(addDays(iso(TODAY), -18)), broker: "Elena Vasquez" },
  { client: "Patel Holdings LLC", property: "Multifamily 24u — Mesa, AZ", proceeds: 6_850_000, closing: iso(addDays(iso(TODAY), -70)), broker: "Rachel Kim" },
  { client: "Okafor Investments", property: "Office Condo — Buckhead, GA", proceeds: 2_100_000, closing: iso(addDays(iso(TODAY), -6)), broker: "Tyler Brooks" },
];

function Tracker({ label, total, elapsed, critical }: { label: string; total: number; elapsed: number; critical?: boolean }) {
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const left = total - elapsed;
  const done = left <= 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className={cn("font-mono font-semibold", critical ? "text-crimson" : done ? "text-muted-foreground" : "text-foreground")}>
          {done ? "Window closed" : `Day ${elapsed} of ${total} · ${left}d left`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", critical ? "bg-crimson animate-pulse" : done ? "bg-muted-foreground/40" : "bg-brand")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function TaxClock() {
  const [rows, setRows] = useState(SEED);
  const [draft, setDraft] = useState({ client: "", closing: iso(TODAY) });
  const totalProceeds = rows.reduce((a, r) => a + r.proceeds, 0);
  const alerts = rows.filter((r) => exchangeStatus(daysBetween(new Date(r.closing), TODAY)).critical).length;

  return (
    <>
      <PageHeader eyebrow="IRC §1031 · Treas. Reg. 1.1031(k)-1" title="1031 Tax Clock" sub="Strict IRS windows: 45 days to identify replacement property, 180 days to close — both counted from the relinquished property's closing date." />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Active Exchanges" value={String(rows.length)} icon={<Timer className="h-4 w-4" />} />
        <Stat label="Proceeds in QI Escrow" value={fmtM(totalProceeds)} icon={<DollarSign className="h-4 w-4" />} />
        <Stat label="Deadline Alerts" value={String(alerts)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Start a New Exchange Clock" sub="Enter the relinquished property's closing date" right={<CalendarClock className="h-4 w-4 text-brand" />} />
        <form className="flex flex-wrap items-end gap-4 p-5" onSubmit={(e) => { e.preventDefault(); if (!draft.client.trim()) return;
          setRows((r) => [{ client: draft.client, property: "Relinquished property", proceeds: 0, closing: draft.closing, broker: "—" }, ...r]); setDraft({ client: "", closing: iso(TODAY) }); }}>
          <div className="min-w-56 flex-1"><Field label="Exchange client"><input className={inputCls} placeholder="e.g. Rivera Family LP" value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} /></Field></div>
          <Field label="Property closing date"><input type="date" className={inputCls} value={draft.closing} max={iso(TODAY)} onChange={(e) => setDraft({ ...draft, closing: e.target.value })} /></Field>
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" />Add clock</button>
        </form>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {rows.map((r) => {
          const elapsed = daysBetween(new Date(r.closing), TODAY);
          const s = exchangeStatus(elapsed);
          return (
            <Card key={r.client + r.closing} className={cn("p-5 transition", s.critical && "border-crimson ring-2 ring-crimson/20")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{r.client}</div>
                  <div className="text-xs text-muted-foreground">{r.property}{r.proceeds ? ` · ${fmtUSD(r.proceeds)}` : ""}</div>
                </div>
                {s.critical && (
                  <span className="flex items-center gap-1 rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold text-crimson-foreground">
                    <AlertTriangle className="h-3 w-3" /> ID DEADLINE EXPIRING
                  </span>
                )}
              </div>
              <div className="mt-5 space-y-4">
                <Tracker label="45-Day Identification Window" total={TAX_WINDOWS.identify} elapsed={elapsed} critical={s.critical} />
                <Tracker label="180-Day Closing Window" total={TAX_WINDOWS.close} elapsed={elapsed} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-[11px]">
                <div><div className="text-muted-foreground">Closed</div><div className="font-mono">{fmtDate(new Date(r.closing))}</div></div>
                <div><div className="text-muted-foreground">ID deadline</div><div className={cn("font-mono", s.critical && "font-semibold text-crimson")}>{fmtDate(addDays(r.closing, 45))}</div></div>
                <div><div className="text-muted-foreground">Close deadline</div><div className="font-mono">{fmtDate(addDays(r.closing, 180))}</div></div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

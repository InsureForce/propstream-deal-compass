import { useState, type DragEvent } from "react";
import { ChevronLeft, ChevronRight, Calculator, GripVertical, Store, Warehouse, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtUSD, fmtM } from "./data";
import { splitCommission } from "./commission";
import { PageHeader } from "./ui";

const STAGES = ["Sourced", "LOI Signed", "Due Diligence", "Under Contract", "Closed"] as const;
type Stage = (typeof STAGES)[number];

type StnlDeal = { id: string; kind: "stnl"; tenant: string; location: string; term: number; value: number; cap: number; stage: Stage };
type IosDeal = { id: string; kind: "ios"; tenant: string; location: string; acres: number; zoning: "Cleared" | "Pending SUP" | "Variance Required"; value: number; stage: Stage };
type Deal = StnlDeal | IosDeal;

const SEED: Deal[] = [
  { id: "s1", kind: "stnl", tenant: "Dollar General", location: "McDonough, GA", term: 14, value: 1_860_000, cap: 6.75, stage: "Closed" },
  { id: "s2", kind: "stnl", tenant: "CVS Pharmacy", location: "Plano, TX", term: 11, value: 6_250_000, cap: 5.6, stage: "Under Contract" },
  { id: "s3", kind: "stnl", tenant: "Starbucks NNN Ground Lease", location: "Frisco, TX", term: 10, value: 3_150_000, cap: 5.35, stage: "Due Diligence" },
  { id: "s4", kind: "stnl", tenant: "Chick-fil-A Ground Lease", location: "Gilbert, AZ", term: 15, value: 4_275_000, cap: 4.25, stage: "LOI Signed" },
  { id: "s5", kind: "stnl", tenant: "Wawa", location: "Brandon, FL", term: 20, value: 6_400_000, cap: 4.85, stage: "Sourced" },
  { id: "s6", kind: "stnl", tenant: "O'Reilly Auto Parts", location: "Gastonia, NC", term: 12, value: 2_240_000, cap: 5.9, stage: "Sourced" },
  { id: "s7", kind: "stnl", tenant: "Tractor Supply Co.", location: "Cumming, GA", term: 13, value: 4_980_000, cap: 5.5, stage: "Closed" },
  { id: "i1", kind: "ios", tenant: "Penske Truck Leasing", location: "Tolleson, AZ", acres: 6.2, zoning: "Cleared", value: 7_800_000, stage: "LOI Signed" },
  { id: "i2", kind: "ios", tenant: "United Rentals", location: "Grand Prairie, TX", acres: 4.2, zoning: "Pending SUP", value: 5_350_000, stage: "Due Diligence" },
  { id: "i3", kind: "ios", tenant: "Maersk Container Logistics", location: "Atlanta, GA", acres: 3.5, zoning: "Cleared", value: 4_100_000, stage: "Sourced" },
  { id: "i4", kind: "ios", tenant: "Ryder System", location: "Tampa, FL", acres: 5.1, zoning: "Cleared", value: 6_650_000, stage: "Under Contract" },
  { id: "i5", kind: "ios", tenant: "Sunbelt Rentals", location: "Charlotte, NC", acres: 2.8, zoning: "Variance Required", value: 3_275_000, stage: "Sourced" },
  { id: "i6", kind: "ios", tenant: "XPO Logistics", location: "Lancaster, TX", acres: 8.4, zoning: "Cleared", value: 9_450_000, stage: "Closed" },
];

export function DealBoard({ initial }: { initial: "stnl" | "ios" }) {
  const [tab, setTab] = useState(initial);
  const [deals, setDeals] = useState<Deal[]>(SEED);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);

  const move = (id: string, stage: Stage) => setDeals((d) => d.map((x) => (x.id === id ? { ...x, stage } : x)));
  const shift = (id: string, dir: -1 | 1) => {
    const d = deals.find((x) => x.id === id)!;
    const i = STAGES.indexOf(d.stage) + dir;
    if (i >= 0 && i < STAGES.length) move(id, STAGES[i]!);
  };
  const visible = deals.filter((d) => d.kind === tab);
  const total = visible.reduce((a, d) => a + d.value, 0);

  return (
    <>
      <PageHeader eyebrow="Transaction Management" title="Deal Pipeline" sub={`${visible.length} deals · ${fmtM(total)} aggregate value · drag cards between stages`} />
      <div className="mb-6 flex gap-1 border-b">
        {([["stnl", "STNL Deals", Store], ["ios", "IOS Deals", Warehouse]] as const).map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={cn("-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition", tab === k ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
            <Icon className="h-4 w-4" />{label}
            <span className="rounded-sm bg-muted px-1.5 font-mono text-[10px]">{deals.filter((d) => d.kind === k).length}</span>
          </button>
        ))}
      </div>
      <div key={tab} className="fade-up -mx-2 flex gap-4 overflow-x-auto px-2 pb-4">
        {STAGES.map((stage) => {
          const col = visible.filter((d) => d.stage === stage);
          return (
            <div key={stage}
              onDragOver={(e: DragEvent) => { e.preventDefault(); setOver(stage); }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={() => { if (dragId) move(dragId, stage); setDragId(null); setOver(null); }}
              className={cn("flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30 transition", over === stage && "border-brand bg-brand/5")}>
              <div className="flex items-center justify-between border-b px-3 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider">{stage}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{col.length} · {fmtM(col.reduce((a, d) => a + d.value, 0))}</span>
              </div>
              <div className="flex min-h-40 flex-col gap-3 p-3">
                {col.map((d) => (
                  <DealCard key={d.id} deal={d} onShift={shift} onDragStart={() => setDragId(d.id)} dragging={dragId === d.id} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function DealCard({ deal, onShift, onDragStart, dragging }: { deal: Deal; onShift: (id: string, dir: -1 | 1) => void; onDragStart: () => void; dragging: boolean }) {
  const [open, setOpen] = useState(false);
  const [agentPct, setAgentPct] = useState(70);
  const idx = STAGES.indexOf(deal.stage);
  const closed = deal.stage === "Closed";
  const c = splitCommission(deal.value, agentPct);
  const ZoneIcon = deal.kind === "ios" ? (deal.zoning === "Cleared" ? ShieldCheck : deal.zoning === "Pending SUP" ? Clock : ShieldAlert) : null;

  return (
    <div draggable onDragStart={onDragStart}
      className={cn("card-surface group cursor-grab p-3.5 transition hover:border-brand active:cursor-grabbing", dragging && "opacity-40")}>
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{deal.kind === "stnl" ? "Tenant Corporate Profile" : "Corporate Tenant Profile"}</div>
          <div className="truncate text-sm font-semibold">{deal.tenant}</div>
          <div className="text-xs text-muted-foreground">{deal.location}</div>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3 text-xs">
        <div><dt className="text-muted-foreground">Deal Value</dt><dd className="font-mono font-medium">{fmtUSD(deal.value)}</dd></div>
        {deal.kind === "stnl" ? (
          <>
            <div><dt className="text-muted-foreground">Target Cap</dt><dd className="font-mono font-medium">{deal.cap.toFixed(2)}%</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Remaining Lease Term</dt><dd className="font-mono font-medium">{deal.term} Years</dd></div>
          </>
        ) : (
          <>
            <div><dt className="text-muted-foreground">Site Acreage</dt><dd className="font-mono font-medium">{deal.acres.toFixed(1)} Acres</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Zoning Clearance</dt>
              <dd className={cn("mt-0.5 inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium",
                deal.zoning === "Cleared" ? "border-success/30 bg-success/10 text-success" : deal.zoning === "Pending SUP" ? "border-warning/30 bg-warning/10 text-warning" : "border-destructive/30 bg-destructive/10 text-destructive")}>
                {ZoneIcon && <ZoneIcon className="h-3 w-3" />}{deal.zoning}
              </dd>
            </div>
          </>
        )}
      </dl>

      {closed && (
        <div className="mt-3 border-t pt-3">
          <button onClick={() => setOpen((o) => !o)}
            className={cn("flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition", open ? "border-brand bg-brand/10 text-brand" : "hover:border-brand hover:text-brand")}>
            <Calculator className="h-3.5 w-3.5" /> Calculate Commission
          </button>
          {open && (
            <div className="fade-up mt-3 space-y-3">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Total commission (3%)</span><span className="font-mono font-semibold text-foreground">{fmtUSD(c.total)}</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span>Agent {agentPct}%</span><span>Firm {100 - agentPct}%</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={agentPct} onChange={(e) => setAgentPct(Number(e.target.value))}
                  onMouseDown={(e) => e.stopPropagation()} draggable={false} onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  aria-label="Agent commission split" className="w-full accent-brand" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border bg-brand/5 p-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Agent</div>
                  <div className="font-mono text-sm font-bold text-brand">{fmtUSD(c.agent)}</div>
                </div>
                <div className="rounded-md border bg-muted/40 p-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Firm</div>
                  <div className="font-mono text-sm font-bold">{fmtUSD(c.firm)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-between opacity-0 transition group-hover:opacity-100">
        <button aria-label="Move back" disabled={idx === 0} onClick={() => onShift(deal.id, -1)} className="rounded border p-0.5 disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5" /></button>
        <button aria-label="Move forward" disabled={idx === STAGES.length - 1} onClick={() => onShift(deal.id, 1)} className="rounded border p-0.5 disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

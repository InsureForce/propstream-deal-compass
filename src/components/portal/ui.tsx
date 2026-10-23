import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface", className)}>{children}</div>;
}

export function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Stat({ label, value, delta, icon }: { label: string; value: string; delta?: string; icon?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        <span className="text-brand">{icon}</span>
      </div>
      <div className="mt-3 font-display text-4xl leading-none tracking-tight">{value}</div>
      {delta && <div className="mt-2 text-xs text-success">{delta}</div>}
    </Card>
  );
}

const stageTone: Record<string, string> = {
  Closed: "bg-success/10 text-success border-success/30",
  "Under Contract": "bg-brand/10 text-brand border-brand/30",
  "Due Diligence": "bg-warning/10 text-warning border-warning/30",
  LOI: "bg-secondary text-foreground border-border",
  Marketing: "bg-muted text-muted-foreground border-border",
  Paid: "bg-success/10 text-success border-success/30",
  Due: "bg-warning/10 text-warning border-warning/30",
};

export function Badge({ children }: { children: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium", stageTone[children] ?? "bg-muted text-muted-foreground border-border")}>
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, sub, right }: { eyebrow: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</div>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight">{title}</h1>
        {sub && <p className="mt-3 max-w-xl text-sm text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full border transition-colors", on ? "bg-brand border-brand" : "bg-muted")}
    >
      <span className={cn("absolute top-0.5 h-4.5 w-4.5 rounded-full bg-card shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

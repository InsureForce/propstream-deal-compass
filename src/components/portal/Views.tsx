import { useState } from "react";
import { DollarSign, Activity, Building, Users, Target, Timer, Sparkles, Send, Palette, Settings2, FileText, Landmark, Download, Lock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortal, ACCENTS } from "./context";
import { activity, agents, brokers, daysBetween, exchanges, fmtM, fmtUSD, invoices, iosDeals, offices, stnlDeals, TODAY, type NavKey } from "./data";
import { Underwriting } from "./Underwriting";
import { DealBoard } from "./DealBoard";
import { TaxClock } from "./TaxClock";
import { Copilot } from "./Copilot";
import { Billing } from "./Billing";
import { Badge, Card, CardHeader, Field, inputCls, PageHeader, Progress, Stat, Toggle } from "./ui";

const ME = "Marcus Delgado";

export function Views({ view }: { view: NavKey }) {
  const { settings, role } = usePortal();
  if (view === "tax" && !settings.taxEnabled) return <Disabled name="1031 Tax Clock" />;
  if (view === "ai" && !settings.aiEnabled) return <Disabled name="AI Copilot" />;
  switch (view) {
    case "overview":
      return role === "CompanyAdmin" ? <AdminConsole /> : role === "BrokerAdmin" ? <FirmDashboard /> : <BrokerDashboard />;
    case "stnl": return <DealBoard initial="stnl" />;
    case "ios": return <DealBoard initial="ios" />;
    case "tax": return <TaxClock />;
    case "ai": return <Copilot />;
    case "billing": return <Billing />;
  }
}

function Disabled({ name }: { name: string }) {
  return (
    <Card className="mx-auto mt-20 max-w-md p-10 text-center">
      <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
      <h2 className="mt-4 font-display text-3xl">{name} is disabled</h2>
      <p className="mt-2 text-sm text-muted-foreground">This feature has been turned off globally by the platform administrator.</p>
    </Card>
  );
}

/* ---------------- CompanyAdmin ---------------- */
function AdminConsole() {
  const { settings: s, setSettings } = usePortal();
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeader eyebrow="Platform Control" title="Backend Console" sub="Configure branding, global features and contract templates for every tenant firm." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="White-Labeling Engine" sub="Changes apply live across the portal" right={<Palette className="h-4 w-4 text-brand" />} />
          <div className="space-y-6 p-5">
            <Field label="Platform logo text">
              <input className={inputCls} value={s.logoText} onChange={(e) => setSettings({ logoText: e.target.value })} />
            </Field>
            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">Global accent color</span>
              <div className="grid grid-cols-6 gap-2">
                {ACCENTS.map((a) => (
                  <button key={a.name} onClick={() => setSettings({ accent: a.value })} title={a.name}
                    className={cn("aspect-square rounded-md border-2 transition hover:scale-105", s.accent === a.value ? "border-foreground" : "border-transparent")}
                    style={{ background: a.value }} />
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">System layout theme</span>
              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((t) => (
                  <button key={t} onClick={() => setSettings({ theme: t })}
                    className={cn("rounded-md border p-3 text-left text-sm capitalize transition", s.theme === t ? "border-brand ring-2 ring-brand/20" : "hover:border-foreground/30")}>
                    <div className={cn("mb-2 flex h-10 overflow-hidden rounded-sm border", t === "dark" ? "dark" : "")}>
                      <div className="w-1/4 bg-sidebar" /><div className="flex-1 bg-background" />
                    </div>
                    {t} workspace
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Global Settings Console" sub="Feature flags & settlement details" right={<Settings2 className="h-4 w-4 text-brand" />} />
          <div className="divide-y">
            {[
              { k: "aiEnabled" as const, t: "AI Copilot", d: "OM drafting, comp analysis & tenant credit summaries" },
              { k: "taxEnabled" as const, t: "1031 Tax Clock", d: "45-day identification & 180-day closing deadlines" },
            ].map((f) => (
              <div key={f.k} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="text-sm font-medium">{f.t} <span className={cn("ml-2 text-[11px]", s[f.k] ? "text-success" : "text-muted-foreground")}>{s[f.k] ? "● ON" : "○ OFF"}</span></div>
                  <div className="text-xs text-muted-foreground">{f.d}</div>
                </div>
                <Toggle label={f.t} on={s[f.k]} onChange={(v) => setSettings({ [f.k]: v })} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t p-5">
            <div className="col-span-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Landmark className="h-3.5 w-3.5" /> Corporate ACH / Wire</div>
            <div className="col-span-2"><Field label="Bank name"><input className={inputCls} value={s.bankName} onChange={(e) => setSettings({ bankName: e.target.value })} /></Field></div>
            <Field label="ABA routing number"><input className={cn(inputCls, "font-mono")} value={s.routing} onChange={(e) => setSettings({ routing: e.target.value })} /></Field>
            <Field label="Account number"><input className={cn(inputCls, "font-mono")} value={s.account} onChange={(e) => setSettings({ account: e.target.value })} /></Field>
            <Field label="SWIFT / BIC"><input className={cn(inputCls, "font-mono")} value={s.swift} onChange={(e) => setSettings({ swift: e.target.value })} /></Field>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Contract Management Desk" sub="Default Statement of Work issued to new tenant firms" right={<FileText className="h-4 w-4 text-brand" />} />
          <div className="p-5">
            <textarea className={cn(inputCls, "min-h-80 font-mono text-[13px] leading-relaxed")} value={s.sow} onChange={(e) => { setSettings({ sow: e.target.value }); setSaved(false); }} />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.sow.split(/\s+/).filter(Boolean).length} words · v4.2</span>
              <button onClick={() => setSaved(true)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                {saved ? "Template saved ✓" : "Save template"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ---------------- BrokerAdmin ---------------- */
function FirmDashboard() {
  const max = Math.max(...offices.map((o) => o.volume));
  return (
    <>
      <PageHeader eyebrow="Meridian Commercial Realty" title="Firm Overview" sub="Company-wide production across 5 regional offices · FY 2026" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total Firm Volume" value="$82M" delta="+18.4% vs FY25" icon={<DollarSign className="h-4 w-4" />} />
        <Stat label="Total Closed Assets" value="35" delta="+4 this month" icon={<Building className="h-4 w-4" />} />
        <Stat label="Firm Revenue YTD" value="$4.2M" icon={<TrendingUp className="h-4 w-4" />} />
        <Stat label="Active Agents" value="12" icon={<Users className="h-4 w-4" />} />
      </div>
      <Underwriting />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Active Transactions by Office" sub="Volume in $M" />
          <div className="space-y-5 p-5">
            {offices.map((o) => (
              <div key={o.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{o.name}</span>
                  <span className="font-mono text-muted-foreground">{o.deals} deals · ${o.volume.toFixed(1)}M</span>
                </div>
                <Progress value={(o.volume / max) * 100} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent Firm Activity" />
          <ul className="divide-y">
            {activity.map((a, i) => (
              <li key={i} className="px-5 py-3.5 text-sm">
                <span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
                <div className="mt-1 text-xs text-muted-foreground">{a.when}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader title="Active Office Agents" sub="12 producing agents · individual production lists" />
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b"><th className="px-5 py-3 font-medium">Agent</th><th className="font-medium">Office</th><th className="font-medium">Production</th><th className="font-medium">Closed</th><th className="pr-5 font-medium">Volume</th></tr>
          </thead>
          <tbody className="divide-y">
            {agents.map((a) => (
              <tr key={a.name} className="align-top transition hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium">{a.name}</td>
                <td className="py-3.5 text-muted-foreground">{a.office}</td>
                <td className="py-3.5"><div className="flex flex-wrap gap-1">{a.deals.map((d) => <span key={d} className="rounded-sm border bg-muted/40 px-1.5 py-0.5 text-[11px]">{d}</span>)}</div></td>
                <td className="py-3.5 font-mono">{a.closed}</td>
                <td className="py-3.5 pr-5 font-mono">${a.volume.toFixed(1)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------------- Broker ---------------- */
function BrokerDashboard() {
  const { settings, go } = usePortal();
  const me = brokers[0]!;
  const mine = [...stnlDeals.filter((d) => d.broker === ME).map((d) => ({ name: `${d.tenant} — ${d.city}`, price: d.price, stage: d.stage, type: "STNL" })),
    ...iosDeals.filter((d) => d.broker === ME).map((d) => ({ name: `${d.site} — ${d.city}`, price: d.price, stage: d.stage, type: "IOS" }))];
  const myEx = exchanges.filter((e) => e.broker === ME);
  return (
    <>
      <PageHeader eyebrow="Good evening, Marcus" title="My Desk" sub="Dallas–Fort Worth office · Net lease & industrial outdoor storage" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Personal Active Pipeline" value="$6.2M" icon={<Activity className="h-4 w-4" />} />
        <Stat label="Commissions Earned" value="$180K" delta="+$42K this quarter" icon={<DollarSign className="h-4 w-4" />} />
        <Stat label="Deals Closed" value="4" icon={<TrendingUp className="h-4 w-4" />} />
        <Stat label="Active 1031 Buyers" value="3" icon={<Timer className="h-4 w-4" />} />
      </div>
      <Underwriting />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="My Active Pipeline" />
          <ul className="divide-y">
            {mine.map((d) => (
              <li key={d.name} className="flex items-center justify-between px-5 py-4 text-sm">
                <div className="flex items-center gap-3"><span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px]">{d.type}</span><span className="font-medium">{d.name}</span></div>
                <div className="flex items-center gap-4"><span className="font-mono">{fmtM(d.price)}</span><Badge>{d.stage}</Badge></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">Commission Target <Target className="h-4 w-4 text-brand" /></div>
          <div className="mt-4 font-display text-5xl">{Math.round((me.gci / me.target) * 100)}%</div>
          <div className="mt-1 text-sm text-muted-foreground">{fmtUSD(me.gci)} of {fmtUSD(me.target)}</div>
          <div className="mt-4"><Progress value={(me.gci / me.target) * 100} /></div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Remaining</span><span className="font-mono">{fmtUSD(me.target - me.gci)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Projected (pipeline)</span><span className="font-mono text-success">+$186,400</span></div>
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {settings.taxEnabled && (
          <Card>
            <CardHeader title="Active 1031 Exchange Clients" right={<button onClick={() => go("tax")} className="text-xs text-brand">Open clock →</button>} />
            <ExchangeList list={myEx} />
          </Card>
        )}
        {settings.aiEnabled && (
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-brand" /> AI Tools</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Draft Offering Memo", "Tenant Credit Brief", "Cap Rate Comps", "Buyer Match (1031)"].map((t) => (
                <button key={t} onClick={() => go("ai")} className="rounded-md border p-4 text-left text-sm transition hover:border-brand hover:bg-brand/5">{t}</button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

/* ---------------- Shared modules ---------------- */
function ExchangeList({ list }: { list: typeof exchanges }) {
  return (
    <ul className="divide-y">
      {list.map((e) => {
        const elapsed = daysBetween(new Date(e.saleDate), TODAY);
        const id45 = 45 - elapsed, close180 = 180 - elapsed;
        return (
          <li key={e.client} className="px-5 py-4">
            <div className="flex items-start justify-between text-sm">
              <div><div className="font-medium">{e.client}</div><div className="text-xs text-muted-foreground">{e.relinquished} · {fmtM(e.proceeds)}</div></div>
              <div className="text-right">
                <div className={cn("font-mono text-sm", id45 > 0 && id45 <= 10 ? "text-destructive" : id45 <= 0 ? "text-muted-foreground" : "text-warning")}>
                  {id45 > 0 ? `${id45}d to identify` : "ID period closed"}
                </div>
                <div className="font-mono text-xs text-muted-foreground">{close180}d to close</div>
              </div>
            </div>
            <div className="mt-3"><Progress value={(elapsed / 180) * 100} /></div>
          </li>
        );
      })}
    </ul>
  );
}


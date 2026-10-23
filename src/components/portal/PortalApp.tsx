import { useEffect, useRef, useState } from "react";
import { PortalCtx, ACCENTS, type Settings } from "./context";
import { Building2, ChevronDown, LayoutDashboard, Store, Warehouse, Timer, Sparkles, CreditCard, Check, ShieldCheck, Briefcase, User, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_SOW, type NavKey, type Role } from "./data";
import { Views } from "./Views";

const roles: { key: Role; label: string; desc: string; icon: typeof User }[] = [
  { key: "CompanyAdmin", label: "Company Admin", desc: "SaaS provider control panel", icon: ShieldCheck },
  { key: "BrokerAdmin", label: "Broker Admin", desc: "Firm principal · Meridian CRE", icon: Briefcase },
  { key: "Broker", label: "Broker", desc: "Marcus Delgado · DFW", icon: User },
];

const nav: { key: NavKey; label: string; icon: typeof User; flag?: "aiEnabled" | "taxEnabled" }[] = [
  { key: "overview", label: "Overview Dashboard", icon: LayoutDashboard },
  { key: "stnl", label: "STNL Pipeline", icon: Store },
  { key: "ios", label: "IOS Pipeline", icon: Warehouse },
  { key: "tax", label: "1031 Tax Clock", icon: Timer, flag: "taxEnabled" },
  { key: "ai", label: "AI Copilot", icon: Sparkles, flag: "aiEnabled" },
  { key: "billing", label: "Enterprise Billing", icon: CreditCard },
];

export function PortalApp() {
  const [role, setRole] = useState<Role>("BrokerAdmin");
  const [view, setView] = useState<NavKey>("overview");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [settings, set] = useState<Settings>({
    logoText: "PropStream",
    accent: ACCENTS[0]!.value,
    theme: "light",
    aiEnabled: true,
    taxEnabled: true,
    bankName: "JPMorgan Chase Bank, N.A.",
    routing: "111000614",
    account: "000004829173",
    swift: "CHASUS33",
    sow: DEFAULT_SOW,
  });
  const setSettings = (s: Partial<Settings>) => set((p) => ({ ...p, ...s }));

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const current = roles.find((r) => r.key === role)!;

  return (
    <PortalCtx.Provider value={{ settings, setSettings, role, go: setView }}>
      <div
        className={cn("flex min-h-screen w-full bg-background text-foreground", settings.theme === "dark" && "dark")}
        style={{ ["--brand" as string]: settings.accent }}
      >
        <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <div className="flex items-center gap-2.5 px-6 py-6">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-brand text-brand-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">{settings.logoText || "PropStream"}</span>
          </div>

          <div ref={ref} className="relative px-4">
            <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-muted">Viewing as</div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-left transition hover:border-brand"
            >
              <current.icon className="h-4 w-4 text-brand" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{current.label}</div>
                <div className="truncate text-xs text-sidebar-muted">{current.desc}</div>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-sidebar-muted transition", open && "rotate-180")} />
            </button>
            {open && (
              <div className="fade-up absolute left-4 right-4 z-20 mt-2 overflow-hidden rounded-md border border-sidebar-border bg-sidebar-accent shadow-2xl">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => { setRole(r.key); setView("overview"); setOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-sidebar"
                  >
                    <r.icon className="h-4 w-4 text-sidebar-muted" />
                    <div className="flex-1">
                      <div className="text-sm">{r.label}</div>
                      <div className="text-xs text-sidebar-muted">{r.desc}</div>
                    </div>
                    {r.key === role && <Check className="h-4 w-4 text-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="mt-8 flex-1 space-y-0.5 px-4">
            <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-muted">Workspace</div>
            {nav.map((n) => {
              const disabled = n.flag && !settings[n.flag];
              const active = view === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setView(n.key)}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                    active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand" />}
                  <n.icon className={cn("h-4 w-4", active && "text-brand")} />
                  <span className="flex-1 text-left">{n.label}</span>
                  {disabled && <span className="rounded-sm border border-sidebar-border px-1.5 text-[10px] uppercase">Off</span>}
                </button>
              );
            })}
          </nav>

          <div className="m-4 rounded-md border border-sidebar-border p-4">
            <div className="text-xs text-sidebar-muted">Meridian Commercial Realty</div>
            <div className="mt-1 text-sm font-medium">Enterprise · 31 seats</div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-10 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search deals, tenants, clients…</span>
              <kbd className="ml-2 rounded border px-1.5 font-mono text-[10px]">⌘K</kbd>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                {role === "Broker" ? "MD" : role === "BrokerAdmin" ? "SC" : "PS"}
              </div>
            </div>
          </header>
          <main key={role + view} className="fade-up mx-auto w-full max-w-7xl flex-1 px-10 py-10">
            <Views view={view} />
          </main>
        </div>
      </div>
    </PortalCtx.Provider>
  );
}

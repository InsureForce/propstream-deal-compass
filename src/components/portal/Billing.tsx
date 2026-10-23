import { useEffect, useState } from "react";
import { Check, Minus, Plus, Printer, ArrowLeft, Building2 } from "lucide-react";
import { fmtUSD } from "./data";
import { BASE_LICENSE_ANNUAL, firmFromQuery, invoiceTotals, SEAT_ANNUAL } from "./billing";
import { usePortal } from "./context";
import { Card, PageHeader } from "./ui";

const usd2 = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function Billing() {
  const { settings: s } = usePortal();
  const [seats, setSeats] = useState(5);
  const [issued, setIssued] = useState(false);
  const [firm, setFirm] = useState("Meridian Commercial Realty");
  useEffect(() => setFirm(firmFromQuery(window.location.search)), []);
  const t = invoiceTotals(seats);

  if (issued) return <Invoice firm={firm} seats={seats} t={t} bank={s} onBack={() => setIssued(false)} logo={s.logoText} />;

  return (
    <>
      <PageHeader eyebrow="Account" title="Enterprise Billing" sub={`Billing entity: ${firm}`} />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Institutional License</div>
              <div className="mt-3 flex items-baseline gap-1"><span className="font-display text-6xl">$499</span><span className="text-muted-foreground">/month</span></div>
              <div className="mt-1 text-sm text-muted-foreground">Billed annually · {fmtUSD(BASE_LICENSE_ANNUAL)}/yr</div>
            </div>
            <span className="rounded-sm border border-brand/30 bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">Most popular</span>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {["STNL & IOS deal boards", "1031 Tax Clock alerts", "AI Copilot memos", "White-label branding", "SOC 2 Type II", "Priority support"].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand" />{f}</li>
            ))}
          </ul>
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-medium">Additional broker seats</div><div className="text-xs text-muted-foreground">{fmtUSD(SEAT_ANNUAL)}/yr per seat</div></div>
              <div className="flex items-center rounded-md border">
                <button aria-label="Remove seat" onClick={() => setSeats((n) => Math.max(0, n - 1))} className="grid h-10 w-10 place-items-center hover:bg-muted"><Minus className="h-4 w-4" /></button>
                <input aria-label="Seats" type="number" min={0} value={seats} onChange={(e) => setSeats(Math.max(0, Number(e.target.value) || 0))} className="h-10 w-16 border-x bg-transparent text-center font-mono outline-none" />
                <button aria-label="Add seat" onClick={() => setSeats((n) => n + 1)} className="grid h-10 w-10 place-items-center hover:bg-muted"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-2 flex flex-col p-8">
          <div className="text-sm font-semibold">Order summary</div>
          <dl className="mt-4 flex-1 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Institutional License (annual)</dt><dd className="font-mono">{fmtUSD(t.base)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{seats} × broker seat</dt><dd className="font-mono">{fmtUSD(t.seats)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total due annually</dt><dd className="font-mono">{fmtUSD(t.total)}</dd></div>
          </dl>
          <button onClick={() => setIssued(true)} className="mt-6 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Upgrade Workspace & Generate Invoice
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Net 30 · Payable by ACH or domestic wire</p>
        </Card>
      </div>
    </>
  );
}

function Invoice({ firm, seats, t, bank, onBack, logo }: { firm: string; seats: number; t: ReturnType<typeof invoiceTotals>; bank: { bankName: string; routing: string; account: string; swift: string }; onBack: () => void; logo: string }) {
  const lines = [
    { d: "PropStream Institutional License — 12-month term", sub: "$499.00/mo billed annually · Nov 1, 2026 – Oct 31, 2027", q: 1, u: BASE_LICENSE_ANNUAL },
    { d: "Additional Broker Seat License", sub: "Annual per-seat subscription", q: seats, u: SEAT_ANNUAL },
  ];
  return (
    <>
      <div className="print:hidden">
        <div className="fade-up mb-6 flex items-center gap-3 rounded-md border border-success/40 bg-success/10 px-5 py-4 text-sm font-semibold text-success">
          ✓ Corporate Invoice Generated Successfully.
        </div>
        <div className="mb-6 flex justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to billing</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Printer className="h-4 w-4" />Print Invoice</button>
        </div>
      </div>

      <article className="paper fade-up mx-auto max-w-[850px] border bg-paper p-14 text-paper-foreground shadow-xl print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-paper-foreground pb-6">
          <div>
            <div className="flex items-center gap-2 text-xl font-semibold tracking-tight"><Building2 className="h-5 w-5" />{logo} Technologies, Inc.</div>
            <div className="mt-2 text-xs leading-relaxed text-paper-muted">2100 Ross Avenue, Suite 2800<br />Dallas, TX 75201<br />billing@propstream.io · EIN 88-4410273</div>
          </div>
          <div className="text-right">
            <div className="font-display text-5xl leading-none">Invoice</div>
            <dl className="mt-3 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-xs">
              <dt className="text-paper-muted">Invoice No.</dt><dd className="font-mono">PS-2026-11042</dd>
              <dt className="text-paper-muted">Issue Date</dt><dd className="font-mono">Oct 23, 2026</dd>
              <dt className="text-paper-muted">Due Date</dt><dd className="font-mono">Nov 22, 2026</dd>
              <dt className="text-paper-muted">Terms</dt><dd className="font-mono">Net 30</dd>
            </dl>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 py-8 text-sm">
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-muted">Bill To</div>
            <div className="text-base font-semibold">{firm}</div>
            <div className="text-xs leading-relaxed text-paper-muted">Attn: Accounts Payable<br />Principal Broker of Record<br />Purchase Order: PO-{firm.slice(0, 3).toUpperCase()}-77310</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-muted">Subscription</div>
            <div className="text-xs leading-relaxed">Plan: Institutional License<br />Seats: {seats} additional broker seats<br />Service period: 11/01/2026 – 10/31/2027</div>
          </div>
        </section>

        <table className="w-full text-sm">
          <thead><tr className="border-y border-paper-foreground text-left text-[10px] uppercase tracking-[0.15em]">
            <th className="py-2.5">Description</th><th className="py-2.5 text-right">Qty</th><th className="py-2.5 text-right">Unit Price</th><th className="py-2.5 text-right">Amount</th>
          </tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.d} className="border-b border-paper-rule align-top">
                <td className="py-3.5"><div className="font-medium">{l.d}</div><div className="text-xs text-paper-muted">{l.sub}</div></td>
                <td className="py-3.5 text-right font-mono">{l.q}</td>
                <td className="py-3.5 text-right font-mono">{usd2(l.u)}</td>
                <td className="py-3.5 text-right font-mono">{usd2(l.q * l.u)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <dl className="w-72 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-paper-muted">Subtotal</dt><dd className="font-mono">{usd2(t.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-paper-muted">Seats total ({seats})</dt><dd className="font-mono">{usd2(t.seats)}</dd></div>
            <div className="flex justify-between"><dt className="text-paper-muted">Sales tax (SaaS exempt)</dt><dd className="font-mono">{usd2(0)}</dd></div>
            <div className="flex justify-between border-t-2 border-paper-foreground pt-2 text-base font-bold"><dt>Total Due (USD)</dt><dd className="font-mono">{usd2(t.total)}</dd></div>
          </dl>
        </div>

        <section className="mt-10 border border-paper-foreground p-5">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]">Remittance Details</div>
          <div className="grid grid-cols-2 gap-6 text-xs">
            <dl className="space-y-1">
              <div className="mb-1 font-semibold">Domestic Wire / ACH</div>
              <div className="flex justify-between"><dt className="text-paper-muted">Bank</dt><dd>{bank.bankName}</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">Bank address</dt><dd>270 Park Ave, New York, NY 10017</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">ABA routing (ACH)</dt><dd className="font-mono">{bank.routing}</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">ABA routing (Wire)</dt><dd className="font-mono">021000021</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">Account no.</dt><dd className="font-mono">{bank.account}</dd></div>
            </dl>
            <dl className="space-y-1">
              <div className="mb-1 font-semibold">Beneficiary</div>
              <div className="flex justify-between"><dt className="text-paper-muted">Name</dt><dd>{logo} Technologies, Inc.</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">SWIFT (intl.)</dt><dd className="font-mono">{bank.swift}</dd></div>
              <div className="flex justify-between"><dt className="text-paper-muted">Reference</dt><dd className="font-mono">PS-2026-11042</dd></div>
              <p className="pt-2 text-paper-muted">Include the invoice number in the wire memo. Remittance advice: ar@propstream.io</p>
            </dl>
          </div>
        </section>

        <footer className="mt-10 flex justify-between border-t border-paper-rule pt-4 text-[10px] text-paper-muted">
          <span>Thank you for your business.</span><span>Page 1 of 1</span>
        </footer>
      </article>
    </>
  );
}

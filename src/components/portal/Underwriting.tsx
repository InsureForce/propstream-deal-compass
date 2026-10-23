import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardHeader, Field, inputCls } from "./ui";
import { fmtUSD } from "./data";
import { computeNOI, computeValuation } from "./underwriting";

const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;

export function Underwriting() {
  const [rent, setRent] = useState("485000");
  const [vac, setVac] = useState("5");
  const [opex, setOpex] = useState("96500");
  const [cap, setCap] = useState(6.25);
  const noi = computeNOI(num(rent), num(vac), num(opex));
  const value = computeValuation(noi, cap);
  return (
    <Card className="mt-6">
      <CardHeader title="Instant Asset Underwriting" sub="Direct capitalization · NOI ÷ market cap rate" right={<Calculator className="h-4 w-4 text-brand" />} />
      <div className="grid gap-6 p-5 lg:grid-cols-3">
        <div className="space-y-4">
          <Field label="Gross Scheduled Rent ($/yr)"><input inputMode="decimal" className={`${inputCls} font-mono`} value={rent} onChange={(e) => setRent(e.target.value)} /></Field>
          <Field label="Vacancy Rate (%)"><input inputMode="decimal" className={`${inputCls} font-mono`} value={vac} onChange={(e) => setVac(e.target.value)} /></Field>
          <Field label="Operating Expenses ($/yr)"><input inputMode="decimal" className={`${inputCls} font-mono`} value={opex} onChange={(e) => setOpex(e.target.value)} /></Field>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 rounded-md border bg-muted/30 p-4 text-sm">
            <div><div className="text-xs text-muted-foreground">Effective Gross Income</div><div className="font-mono">{fmtUSD(num(rent) * (1 - num(vac) / 100))}</div></div>
            <div><div className="text-xs text-muted-foreground">Operating Expenses</div><div className="font-mono">−{fmtUSD(num(opex))}</div></div>
            <div><div className="text-xs text-muted-foreground">Net Operating Income</div><div className="font-mono font-semibold">{fmtUSD(noi)}</div></div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
              <span>Market Cap Rate</span><span className="font-mono text-foreground">{cap.toFixed(2)}%</span>
            </div>
            <input type="range" min={4} max={9} step={0.05} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="w-full accent-valuation" aria-label="Market Cap Rate" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground"><span>4.00%</span><span>9.00%</span></div>
          </div>
          <div className="rounded-md border border-valuation/30 bg-valuation/5 p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Institutional Asset Valuation</div>
            <div className="mt-2 font-mono text-4xl font-bold tracking-tight text-valuation">{fmtUSD(value)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

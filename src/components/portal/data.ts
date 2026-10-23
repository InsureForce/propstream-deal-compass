export type Role = "CompanyAdmin" | "BrokerAdmin" | "Broker";
export type NavKey = "overview" | "stnl" | "ios" | "tax" | "ai" | "billing";

export const offices = [
  { name: "Dallas–Fort Worth", deals: 14, volume: 24.6, brokers: 9 },
  { name: "Phoenix", deals: 11, volume: 18.2, brokers: 7 },
  { name: "Atlanta", deals: 9, volume: 16.9, brokers: 6 },
  { name: "Charlotte", deals: 7, volume: 12.1, brokers: 5 },
  { name: "Tampa", deals: 6, volume: 10.2, brokers: 4 },
];

export const brokers = [
  { name: "Marcus Delgado", office: "Dallas–Fort Worth", ytd: 14.8, deals: 6, gci: 412000, target: 550000 },
  { name: "Rachel Kim", office: "Phoenix", ytd: 11.3, deals: 5, gci: 318500, target: 400000 },
  { name: "Tyler Brooks", office: "Atlanta", ytd: 9.7, deals: 4, gci: 271000, target: 375000 },
  { name: "Elena Vasquez", office: "Charlotte", ytd: 8.4, deals: 4, gci: 236000, target: 325000 },
  { name: "Jordan Whitfield", office: "Tampa", ytd: 6.9, deals: 3, gci: 189000, target: 300000 },
];

export const activity = [
  { who: "Marcus Delgado", what: "moved Starbucks — Frisco, TX to Under Contract", when: "12m ago" },
  { who: "Rachel Kim", what: "uploaded LOI for Industrial Outdoor Storage — Tolleson, AZ", when: "48m ago" },
  { who: "Tyler Brooks", what: "closed Dollar General — McDonough, GA ($1.86M)", when: "2h ago" },
  { who: "Elena Vasquez", what: "identified 3 replacement properties for Henderson 1031", when: "4h ago" },
  { who: "Jordan Whitfield", what: "added new listing: Wawa — Brandon, FL", when: "Yesterday" },
];

export const stnlDeals = [
  { tenant: "Starbucks", city: "Frisco, TX", price: 3150000, cap: 5.35, term: "10 yrs NNN", stage: "Under Contract", broker: "Marcus Delgado" },
  { tenant: "Wawa", city: "Brandon, FL", price: 6400000, cap: 4.85, term: "20 yrs Abs. NNN", stage: "Marketing", broker: "Jordan Whitfield" },
  { tenant: "Chick-fil-A (Ground Lease)", city: "Gilbert, AZ", price: 4275000, cap: 4.25, term: "15 yrs GL", stage: "LOI", broker: "Rachel Kim" },
  { tenant: "Dollar General", city: "McDonough, GA", price: 1860000, cap: 6.75, term: "15 yrs NNN", stage: "Closed", broker: "Tyler Brooks" },
  { tenant: "O'Reilly Auto Parts", city: "Gastonia, NC", price: 2240000, cap: 5.9, term: "12 yrs NNN", stage: "Due Diligence", broker: "Elena Vasquez" },
  { tenant: "Walgreens", city: "Arlington, TX", price: 5890000, cap: 6.1, term: "8 yrs NN", stage: "Marketing", broker: "Marcus Delgado" },
];

export const iosDeals = [
  { site: "Tolleson Yard", city: "Tolleson, AZ", acres: 6.2, price: 7800000, use: "Truck & Trailer Parking", stage: "LOI", broker: "Rachel Kim" },
  { site: "I-20 Laydown", city: "Grand Prairie, TX", acres: 4.8, price: 5350000, use: "Equipment Storage", stage: "Due Diligence", broker: "Marcus Delgado" },
  { site: "Fulton Industrial Lot", city: "Atlanta, GA", acres: 3.5, price: 4100000, use: "Container Storage", stage: "Marketing", broker: "Tyler Brooks" },
  { site: "Port Tampa Yard", city: "Tampa, FL", acres: 5.1, price: 6650000, use: "Fleet Parking", stage: "Under Contract", broker: "Jordan Whitfield" },
];

export const exchanges = [
  { client: "Henderson Family Trust", relinquished: "Retail Strip — Plano, TX", proceeds: 4200000, saleDate: "2026-09-02", broker: "Marcus Delgado" },
  { client: "Patel Holdings LLC", relinquished: "Multifamily 24u — Mesa, AZ", proceeds: 6850000, saleDate: "2026-08-14", broker: "Rachel Kim" },
  { client: "Okafor Investments", relinquished: "Office Condo — Buckhead, GA", proceeds: 2100000, saleDate: "2026-07-01", broker: "Tyler Brooks" },
  { client: "Lindqvist Revocable Trust", relinquished: "Flex Industrial — Matthews, NC", proceeds: 3375000, saleDate: "2026-10-05", broker: "Marcus Delgado" },
];

export const invoices = [
  { id: "INV-2026-1042", period: "Oct 2026", seats: 31, amount: 18600, status: "Due" },
  { id: "INV-2026-0981", period: "Sep 2026", seats: 30, amount: 18000, status: "Paid" },
  { id: "INV-2026-0917", period: "Aug 2026", seats: 28, amount: 16800, status: "Paid" },
  { id: "INV-2026-0855", period: "Jul 2026", seats: 28, amount: 16800, status: "Paid" },
];

export const DEFAULT_SOW = `STATEMENT OF WORK — PropStream Enterprise

1. Parties. This SOW is entered into between PropStream Technologies, Inc. ("Provider") and the licensed brokerage identified in the Order Form ("Client").

2. Scope. Provider will deliver: (a) white-labeled broker portal; (b) STNL and IOS pipeline modules; (c) 1031 Exchange deadline tracking (45/180-day); (d) AI Copilot for OM drafting and comp analysis.

3. Term. Twelve (12) months from the Effective Date, auto-renewing for successive 12-month terms unless terminated with 60 days' written notice.

4. Fees. $600 per active broker seat per month, billed monthly via ACH or wire. Implementation fee: $7,500 (one-time).

5. Service Levels. 99.9% monthly uptime; P1 response within 1 business hour.

6. Data. Client retains ownership of all transaction data. Provider maintains SOC 2 Type II controls.`;

export const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;
export const fmtUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const TODAY = new Date("2026-10-23");
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

export const agents = [
  { name: "Marcus Delgado", office: "Dallas–Fort Worth", closed: 4, volume: 14.8, deals: ["Starbucks — Frisco", "Walgreens — Arlington", "I-20 Laydown"] },
  { name: "Rachel Kim", office: "Phoenix", closed: 4, volume: 11.3, deals: ["Chick-fil-A GL — Gilbert", "Tolleson Yard"] },
  { name: "Tyler Brooks", office: "Atlanta", closed: 3, volume: 9.7, deals: ["Dollar General — McDonough", "Fulton Industrial Lot"] },
  { name: "Elena Vasquez", office: "Charlotte", closed: 3, volume: 8.4, deals: ["O'Reilly — Gastonia"] },
  { name: "Jordan Whitfield", office: "Tampa", closed: 3, volume: 6.9, deals: ["Wawa — Brandon", "Port Tampa Yard"] },
  { name: "Priya Raman", office: "Dallas–Fort Worth", closed: 3, volume: 6.2, deals: ["Take 5 Oil — McKinney", "AutoZone — Denton"] },
  { name: "Caleb Morrison", office: "Phoenix", closed: 3, volume: 5.6, deals: ["Raising Cane's — Chandler"] },
  { name: "Danielle Ortiz", office: "Atlanta", closed: 3, volume: 4.9, deals: ["Tractor Supply — Cumming", "Marietta IOS"] },
  { name: "Brandon Huang", office: "Charlotte", closed: 3, volume: 4.3, deals: ["Aldi — Concord"] },
  { name: "Natalie Fischer", office: "Tampa", closed: 2, volume: 3.8, deals: ["7-Eleven — Lakeland"] },
  { name: "Omar Haddad", office: "Dallas–Fort Worth", closed: 2, volume: 3.2, deals: ["Lancaster Truck Yard"] },
  { name: "Sophie Laurent", office: "Phoenix", closed: 2, volume: 2.9, deals: ["Dutch Bros — Mesa"] },
];

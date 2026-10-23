export const BASE_LICENSE_ANNUAL = 5988; // $499/mo billed annually
export const SEAT_ANNUAL = 240;
export function invoiceTotals(extraSeats: number, taxRate = 0) {
  const seats = Math.max(0, Math.floor(extraSeats)) * SEAT_ANNUAL;
  const subtotal = BASE_LICENSE_ANNUAL + seats;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  return { base: BASE_LICENSE_ANNUAL, seats, subtotal, tax, total: subtotal + tax };
}
const FIRMS: Record<string, string> = { apex: "APEX", boulder: "Boulder Group" };
export function firmFromQuery(search: string) {
  const key = new URLSearchParams(search).get("firm")?.toLowerCase() ?? "";
  return FIRMS[key] ?? "Meridian Commercial Realty";
}
export const TAX_WINDOWS = { identify: 45, close: 180 };
export function exchangeStatus(daysElapsed: number) {
  const idLeft = TAX_WINDOWS.identify - daysElapsed;
  return { idLeft, closeLeft: TAX_WINDOWS.close - daysElapsed, critical: idLeft > 0 && idLeft <= 7 };
}

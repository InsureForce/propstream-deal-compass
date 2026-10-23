export function computeNOI(grossRent: number, vacancyPct: number, opex: number) {
  return grossRent * (1 - vacancyPct / 100) - opex;
}
export function computeValuation(noi: number, capPct: number) {
  return capPct > 0 ? noi / (capPct / 100) : 0;
}

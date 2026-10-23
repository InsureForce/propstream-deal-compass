import { describe, it, expect } from "vitest";
import { invoiceTotals, firmFromQuery, exchangeStatus } from "./billing";
describe("billing", () => {
  it("base license is $5,988/yr with no extra seats", () => expect(invoiceTotals(0).total).toBe(5988));
  it("each extra seat adds $240/yr", () => expect(invoiceTotals(5).total).toBe(5988 + 1200));
  it("?firm=apex bills APEX", () => expect(firmFromQuery("?firm=apex")).toBe("APEX"));
  it("?firm=boulder bills Boulder Group", () => expect(firmFromQuery("?firm=boulder")).toBe("Boulder Group"));
});
describe("1031 clock", () => {
  it("day 38 is critical with 7 days left to identify", () => expect(exchangeStatus(38)).toEqual({ idLeft: 7, closeLeft: 142, critical: true }));
  it("day 20 is not critical", () => expect(exchangeStatus(20).critical).toBe(false));
});

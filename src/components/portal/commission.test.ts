import { describe, it, expect } from "vitest";
import { splitCommission } from "./commission";
describe("commission split", () => {
  it("total commission is 3% of deal value", () => {
    expect(splitCommission(2_000_000, 70).total).toBe(60_000);
  });
  it("70/30 split distributes agent and firm shares", () => {
    const r = splitCommission(2_000_000, 70);
    expect(r.agent).toBe(42_000);
    expect(r.firm).toBe(18_000);
  });
});

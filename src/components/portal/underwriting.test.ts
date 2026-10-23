import { describe, it, expect } from "vitest";
import { computeNOI, computeValuation } from "./underwriting";

describe("underwriting", () => {
  it("NOI = gross rent less vacancy less opex", () => {
    expect(computeNOI(500000, 5, 120000)).toBe(355000);
  });
  it("valuation = NOI / cap rate", () => {
    expect(computeValuation(355000, 5)).toBe(7100000);
  });
});

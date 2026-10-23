export const COMMISSION_RATE = 0.03;
export function splitCommission(dealValue: number, agentPct: number) {
  const total = dealValue * COMMISSION_RATE;
  const agent = total * (agentPct / 100);
  return { total, agent, firm: total - agent };
}

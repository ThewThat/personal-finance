import type { DcaResult } from "../types";

/**
 * Calculate Dollar-Cost Averaging projection.
 */
export function calcDCA(
  monthlyAmount: number,
  years: number,
  annualReturn: number
): DcaResult {
  const r = annualReturn / 100 / 12;
  const n = years * 12;
  const totalInvested = monthlyAmount * n;
  const futureValue =
    r === 0 ? totalInvested : monthlyAmount * ((Math.pow(1 + r, n) - 1) / r);

  const schedule: DcaResult["schedule"] = [];
  let running = 0;
  for (let m = 1; m <= n; m++) {
    running = running * (1 + r) + monthlyAmount;
    if (m % 12 === 0) {
      schedule.push({
        year: m / 12,
        value: running,
        invested: monthlyAmount * m,
      });
    }
  }

  return {
    totalInvested,
    futureValue,
    profit: futureValue - totalInvested,
    cagr: (Math.pow(futureValue / totalInvested, 1 / years) - 1) * 100,
    schedule,
  };
}

"use client";

import { type FC } from "react";
import { fmt, fB } from "../utils/formatters";
import { useDca } from "../context/DcaContext";
import { GrowthChart } from "./GrowthChart";

export const DcaTab: FC = () => {
  const { state, dca, dispatch } = useDca();
  const { dcaConfig } = state;
  const fields = [
    { l: "Monthly Amount (THB)", k: "monthlyAmount" as const },
    { l: "Day of Month", k: "dayOfMonth" as const },
    { l: "Period (Years)", k: "years" as const },
    { l: "Expected Return %", k: "expectedReturn" as const },
  ];

  const summaryCards = [
    { l: "Total Invested", v: fB(dca.totalInvested) },
    { l: "Future Value", v: fB(dca.futureValue), c: "text-dca-cyan" },
    { l: "Total Profit", v: fB(dca.profit), c: "text-dca-green" },
    { l: "CAGR", v: `${fmt(dca.cagr)}%`, c: "text-dca-amber" },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="grid grid-cols-[290px_1fr] gap-[18px]">
        {/* Config panel */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
          <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono mb-3.5">
            DCA CONFIG
          </div>
          {fields.map((f) => (
            <div key={f.k} className="mb-3">
              <div className="text-[9px] text-dca-muted uppercase tracking-widest font-mono mb-1.5">
                {f.l}
              </div>
              <input
                type="number"
                value={dcaConfig[f.k]}
                onChange={(e) =>
                    dispatch({
                      type: "UPDATE_DCA",
                      payload: { [f.k]: +e.target.value },
                    })
                }
                className="w-full bg-dca-card border border-dca-border rounded-md text-dca-text px-3 py-2 text-[13px] font-mono outline-none focus:border-dca-cyan transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            {summaryCards.map((k, i) => (
              <div
                key={i}
                className="bg-dca-panel border border-dca-border rounded-[10px] p-5"
              >
                <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
                  {k.l}
                </div>
                <div
                  className={`text-xl font-mono font-bold mt-1.5 ${k.c ?? "text-dca-text"}`}
                >
                  {k.v}
                </div>
              </div>
            ))}
          </div>

          {/* Growth chart */}
          <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
            <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono mb-3">
              GROWTH PROJECTION
            </div>
            <GrowthChart dca={dca} />
          </div>
        </div>
      </div>
    </div>
  );
};

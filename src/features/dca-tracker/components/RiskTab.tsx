"use client";

import { type FC } from "react";
import { fmt, fU } from "../utils/formatters";
import { useDca } from "../context/DcaContext";
import { HealthRadar } from "./HealthRadar";

export const RiskTab: FC = () => {
  const { port, risk, state } = useDca();
  const assetCount = state.assets.length;
  const metricCards = [
    {
      l: "Sharpe Ratio",
      v: risk.sharpe,
      c:
        +risk.sharpe > 1
          ? "text-dca-green"
          : +risk.sharpe > 0
            ? "text-dca-amber"
            : "text-dca-red",
    },
    { l: "Std Deviation", v: `${risk.std}%` },
    { l: "Max Drawdown", v: `-${risk.maxDD}%`, c: "text-dca-red" },
    { l: "Beta", v: risk.beta },
    {
      l: "Concentration",
      v: risk.conc,
      c:
        risk.conc === "HIGH"
          ? "text-dca-red"
          : risk.conc === "MEDIUM"
            ? "text-dca-amber"
            : "text-dca-green",
    },
  ];

  const healthScores = [
    {
      n: "Diversification",
      s: Math.min(100, assetCount * 20),
    },
    {
      n: "Profitability",
      s: Math.min(100, Math.max(0, port.totalPnlPct * 2)),
    },
    {
      n: "Stability",
      s: Math.min(100, Math.max(0, +risk.sharpe * 40)),
    },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Metric cards */}
      <div className="grid grid-cols-5 gap-3.5">
        {metricCards.map((k, i) => (
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

      <div className="grid grid-cols-2 gap-[18px]">
        {/* Asset breakdown */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
          <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono mb-3.5">
            ASSET PERFORMANCE
          </div>
          {port.assets.map((a) => (
            <div key={a.id} className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-dca-cyan font-bold">{a.symbol}</span>
                <span
                  className={`text-xs ${a.pnlPct >= 0 ? "text-dca-green" : "text-dca-red"}`}
                >
                  {a.pnlPct >= 0 ? "+" : ""}
                  {fmt(a.pnlPct)}%
                </span>
              </div>
              <div className="w-full h-[5px] bg-dca-card rounded-sm">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${a.allocation}%`,
                    background: `linear-gradient(90deg, ${a.color}, ${a.color}88)`,
                  }}
                />
              </div>
              <div className="text-[10px] text-dca-muted mt-0.5">
                {fmt(a.allocation)}% allocation · {fU(a.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Health scores */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
          <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono mb-3.5">
            HEALTH ANALYSIS
          </div>
          <HealthRadar data={healthScores} />
          
          <div className="mt-2 space-y-3">
            {healthScores.map((s) => {
                const color = s.s > 60 ? "text-dca-green" : s.s > 30 ? "text-dca-amber" : "text-dca-red";
                return (
                    <div key={s.n} className="flex justify-between items-center text-xs p-2 bg-dca-card/50 rounded-lg">
                        <span className="text-dca-muted">{s.n}</span>
                        <span className={`${color} font-bold font-mono`}>{s.s.toFixed(0)}/100</span>
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

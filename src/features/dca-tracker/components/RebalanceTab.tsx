"use client";

import { type FC } from "react";
import { fmt, fU } from "../utils/formatters";
import { Pie } from "./Pie";

import { useDca } from "../context/DcaContext";

export const RebalanceTab: FC = () => {
  const { rebal, state, dispatch } = useDca();
  const { assets } = state;
  const targetSum = rebal.reduce((s, a) => s + a.targetAllocation, 0);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="grid grid-cols-[1fr_250px] gap-[18px]">
        {/* Rebalance table */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
          <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono mb-3.5">
            REBALANCE SUGGESTIONS
          </div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-dca-border">
                {[
                  "Asset",
                  "Value",
                  "Current",
                  "Target",
                  "Diff",
                  "Action",
                  "Shares",
                ].map((h) => (
                  <th
                    key={h}
                    className={`text-[9px] text-dca-muted uppercase tracking-widest font-mono font-normal px-2 py-1.5 ${
                      h === "Asset" ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rebal.map((a) => (
                <tr key={a.id} className="border-b border-dca-panel">
                  <td className="px-2 py-2 flex items-center gap-[7px]">
                    <div
                      className="w-2 h-2 rounded-sm"
                      style={{ background: a.color }}
                    />
                    <span className="text-dca-cyan font-bold">{a.symbol}</span>
                  </td>
                  <td className="px-2 py-2 text-right text-dca-muted">
                    {fU(a.value)}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {fmt(a.allocation)}%
                  </td>
                  <td className="px-2 py-2 text-right">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={a.targetAllocation}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_TARGET",
                          id: a.id,
                          value: +e.target.value,
                        })
                      }
                      className="w-[52px] bg-dca-card border border-dca-border rounded-md text-dca-text px-1.5 py-0.5 text-[11px] font-mono text-center outline-none focus:border-dca-cyan transition-colors"
                    />
                  </td>
                  <td
                    className={`px-2 py-2 text-right font-semibold ${a.diff >= 0 ? "text-dca-green" : "text-dca-red"}`}
                  >
                    {a.diff >= 0 ? "+" : ""}
                    {fU(a.diff)}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span
                      className={`px-[7px] py-0.5 rounded text-[10px] font-bold ${
                        a.action === "BUY"
                          ? "bg-dca-green/20 text-dca-green"
                          : a.action === "SELL"
                            ? "bg-dca-red/20 text-dca-red"
                            : "bg-dca-card text-dca-muted"
                      }`}
                    >
                      {a.action}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right font-bold">
                    {a.action !== "HOLD" ? a.rebalShares : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 p-2.5 bg-dca-card rounded-md text-[11px] text-dca-muted">
            Target sum:{" "}
            <strong
              className={targetSum === 100 ? "text-dca-green" : "text-dca-red"}
            >
              {targetSum}%
            </strong>{" "}
            (must be 100%)
          </div>
        </div>

        {/* Current vs Target pies */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5 flex flex-col gap-3">
          <span className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
            CURRENT vs TARGET
          </span>
          <div className="flex gap-3 justify-center">
            <div className="text-center">
              <div className="text-[10px] text-dca-muted mb-1">NOW</div>
              <Pie
                data={rebal.map((a) => ({
                  label: a.symbol,
                  value: a.value,
                }))}
                size={105}
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] text-dca-muted mb-1">TARGET</div>
              <Pie
                data={assets.map((a) => ({
                  label: a.symbol,
                  value: a.targetAllocation,
                }))}
                size={105}
              />
            </div>
          </div>
          {rebal.map((a) => (
            <div key={a.id}>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-dca-muted">{a.symbol}</span>
                <span className="text-dca-muted">
                  {fmt(a.allocation)}%→
                  <strong className="text-dca-text">
                    {a.targetAllocation}%
                  </strong>
                </span>
              </div>
              <div className="flex h-1">
                <div
                  className="opacity-70 rounded-l-sm"
                  style={{
                    width: `${a.allocation}%`,
                    background: a.color,
                  }}
                />
                <div className="flex-1 bg-dca-card" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

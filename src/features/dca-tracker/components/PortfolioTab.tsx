"use client";

import { useState, type FC } from "react";
import { TYPE_COLORS } from "../constants";
import { fmt, fU } from "../utils/formatters";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { Pie } from "./Pie";
import { EditAssetModal } from "./EditAssetModal";
import type { Asset } from "../types";

import { useDca } from "../context/DcaContext";

export const PortfolioTab: FC = () => {
  const { port, state, dispatch, setShowAdd } = useDca();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const transactionCount = state.transactions.length;
  const onAddAsset = () => setShowAdd(true);

  const summaryCards = [
    { l: "Total Invested", v: fU(port.totalCost) },
    { l: "Market Value", v: fU(port.total), c: "text-dca-cyan" },
    {
      l: "Unrealized P/L",
      v: (port.totalPnl >= 0 ? "+" : "") + fU(port.totalPnl),
      c: port.totalPnl >= 0 ? "text-dca-green" : "text-dca-red",
      s: `${fmt(port.totalPnlPct)}%`,
    },
    {
      l: "Holdings",
      v: String(port.assets.length),
      s: `${transactionCount} transactions`,
    },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3.5">
        {summaryCards.map((k, i) => (
          <div
            key={i}
            className="bg-dca-panel border border-dca-border rounded-[10px] p-5"
          >
            <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
              {k.l}
            </div>
            <div
              className={`text-[22px] font-mono font-bold mt-1.5 ${k.c ?? "text-dca-text"}`}
            >
              {k.v}
            </div>
            {k.s && <div className="text-dca-muted text-xs">{k.s}</div>}
          </div>
        ))}
      </div>

      {/* Holdings table + Allocation pie */}
      <div className="grid grid-cols-[1fr_250px] gap-[18px]">
        {/* Holdings */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
              HOLDINGS
            </span>
            <Button
              onClick={onAddAsset}
              variant="primary"
              className="text-[11px] px-2.5 py-1"
            >
              <Icon name="plus" size={11} /> ADD
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-dca-border">
                  {[
                    "Symbol",
                    "Type",
                    "Shares",
                    "Avg Cost",
                    "Price",
                    "Value",
                    "P/L",
                    "P/L%",
                    "Alloc",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`text-[10px] text-dca-muted uppercase tracking-widest font-mono font-normal px-2.5 py-1.5 ${
                        h === "Symbol" ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {port.assets.map((a) => (
                  <tr key={a.id} className="border-b border-dca-panel">
                    <td className="px-2.5 py-2">
                      <div className="flex items-center gap-[7px]">
                        <div
                          className="w-2 h-2 rounded-sm"
                          style={{ background: a.color }}
                        />
                        <span className="text-dca-cyan font-bold">
                          {a.symbol}
                        </span>
                      </div>
                      <div className="text-[10px] text-dca-muted">
                        {a.name.slice(0, 20)}
                      </div>
                    </td>
                    <td className="px-2.5 py-2 text-right">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{
                          background: TYPE_COLORS[a.type] + "22",
                          color: TYPE_COLORS[a.type],
                        }}
                      >
                        {a.type}
                      </span>
                    </td>
                    <td className="px-2.5 py-2 text-right text-dca-muted">
                      {fmt(a.shares, 4)}
                    </td>
                    <td className="px-2.5 py-2 text-right text-dca-muted">
                      {fU(a.averageCost)}
                    </td>
                    <td className="px-2.5 py-2 text-right font-bold">
                      {fU(a.currentPrice)}
                    </td>
                    <td className="px-2.5 py-2 text-right font-bold text-dca-cyan">
                      {fU(a.value)}
                    </td>
                    <td
                      className={`px-2.5 py-2 text-right font-semibold ${a.pnl >= 0 ? "text-dca-green" : "text-dca-red"}`}
                    >
                      {a.pnl >= 0 ? "+" : ""}
                      {fU(a.pnl)}
                    </td>
                    <td
                      className={`px-2.5 py-2 text-right ${a.pnlPct >= 0 ? "text-dca-green" : "text-dca-red"}`}
                    >
                      {a.pnlPct >= 0 ? "+" : ""}
                      {fmt(a.pnlPct)}%
                    </td>
                    <td className="px-2.5 py-2 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <div className="w-9 h-[3px] bg-dca-card rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm"
                            style={{
                              width: `${a.allocation}%`,
                              background: a.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-dca-muted">
                          {fmt(a.allocation)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2.5 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingAsset(a)}
                          className="bg-transparent border-none text-dca-dim cursor-pointer hover:text-dca-cyan transition-colors"
                          title="Edit Asset"
                        >
                          <Icon name="edit" size={12} />
                        </button>
                        <button
                          onClick={() =>
                            dispatch({ type: "DELETE_ASSET", id: a.id })
                          }
                          className="bg-transparent border-none text-dca-dim cursor-pointer hover:text-dca-red transition-colors"
                          title="Delete Asset"
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation sidebar */}
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5 flex flex-col gap-3">
          <span className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
            ALLOCATION
          </span>
          <div className="flex justify-center">
            <Pie
              data={port.assets.map((a) => ({
                label: a.symbol,
                value: a.value,
              }))}
              size={140}
            />
          </div>
          {port.assets.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-[7px]">
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: a.color }}
                />
                <span className="text-[11px] text-dca-muted">{a.symbol}</span>
              </div>
              <span className="text-xs font-bold">{fmt(a.allocation)}%</span>
            </div>
          ))}
        </div>
      </div>

      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

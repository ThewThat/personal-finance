"use client";

import { useState, useEffect, useCallback, useRef, type FC } from "react";
import type { Asset, PriceData } from "../types";
import { TYPE_COLORS } from "../constants";
import { PriceService } from "../services/price-service";
import { fmt, fU, fB } from "../utils/formatters";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import { Button } from "./Button";
import { PriceChart } from "./PriceChart";
import { Modal } from "./Modal";

import { useDca } from "../context/DcaContext";

export const LivePricesPanel: FC = () => {
  const { state, dispatch, apiKeys, setApiKeys } = useDca();
  const { assets } = state;
  const [pData, setPData] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [selected, setSelected] = useState(assets[0]?.symbol ?? "");
  const [auto, setAuto] = useState(true);
  const [lastUp, setLastUp] = useState<Date | null>(null);
  const [showKeys, setShowKeys] = useState(false);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOne = useCallback(
    async (asset: Asset) => {
      setLoading((m) => ({ ...m, [asset.symbol]: true }));
      setErrors((m) => ({ ...m, [asset.symbol]: null }));
      try {
        const d = await PriceService.fetch(asset.symbol, asset.type, apiKeys);
        setPData((p) => ({ ...p, [asset.symbol]: d }));
        dispatch({ type: "UPDATE_PRICE", id: asset.id, price: d.price });
        setLastUp(new Date());
      } catch (e) {
        setErrors((m) => ({ ...m, [asset.symbol]: (e as Error).message }));
      } finally {
        setLoading((m) => ({ ...m, [asset.symbol]: false }));
      }
    },
    [apiKeys, dispatch]
  );

  const fetchAll = useCallback(
    () => assets.forEach((a) => fetchOne(a)),
    [assets, fetchOne]
  );

  useEffect(() => {
    if (auto) {
      // Execute immediately on mount or when auto is turned on
      fetchAll();
      iRef.current = setInterval(fetchAll, 60000);
    } else if (iRef.current) {
      clearInterval(iRef.current);
    }
    return () => {
      if (iRef.current) clearInterval(iRef.current);
    };
  }, [auto, fetchAll]);

  const sel = assets.find((a) => a.symbol === selected);
  const sd = pData[selected];
  const dc = sd ? sd.price - (sd.previousClose ?? sd.price) : 0;
  const dcp = sd?.previousClose ? (dc / sd.previousClose) * 100 : 0;

  const APIS = [
    { name: "Yahoo Finance", free: true, avail: true },
    { name: "CoinGecko", free: true, avail: true },
    // { name: "Finnhub", free: false, avail: !!apiKeys.finnhub },
    // { name: "Alpha Vantage", free: false, avail: !!apiKeys.alphaVantage },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex justify-between items-center flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full ${auto ? "bg-dca-green animate-pulse" : "bg-dca-dim"}`}
          />
          <span className="text-dca-muted font-mono text-[13px] uppercase tracking-wider">
            LIVE MARKET DATA
          </span>
          {lastUp && (
            <span className="text-dca-muted text-[11px]">
              Updated {lastUp.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* <Button
            onClick={() => setShowKeys(true)}
            variant="ghost"
            className="text-[11px] px-2.5 py-1"
          >
            <Icon name="key" size={12} /> API KEYS
          </Button> */}
          <Button
            onClick={() => setAuto((v) => !v)}
            variant={auto ? "success" : "ghost"}
            className="text-[11px] px-2.5 py-1"
          >
            <Icon name="wifi" size={12} />{" "}
            {auto ? "AUTO ● ON" : "AUTO OFF"}
          </Button>
          <Button
            onClick={fetchAll}
            variant="primary"
            className="text-[11px] px-2.5 py-1"
          >
            <Icon name="refresh" size={12} /> REFRESH ALL
          </Button>
        </div>
      </div>

      {/* API status pills */}
      <div className="flex gap-2 flex-wrap">
        {APIS.map((a) => (
          <div
            key={a.name}
            className={`bg-dca-card rounded-full px-3 py-0.5 flex items-center gap-1.5 border ${
              a.avail ? "border-dca-green/25" : "border-dca-border"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${a.avail ? "bg-dca-green" : "bg-dca-dim"}`}
            />
            <span
              className={`text-[10px] font-mono ${a.avail ? "text-dca-green" : "text-dca-muted"}`}
            >
              {a.name}
            </span>
            {a.free && (
              <span className="text-[9px] font-mono text-dca-dim">FREE</span>
            )}
          </div>
        ))}
      </div>

      {/* Asset ticker cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
        {assets.map((asset) => {
          const pd = pData[asset.symbol];
          const ld = loading[asset.symbol];
          const er = errors[asset.symbol];
          const chg = pd
            ? pd.price - (pd.previousClose ?? pd.price)
            : 0;
          const chgP = pd?.previousClose
            ? (chg / pd.previousClose) * 100
            : 0;
          const isSel = selected === asset.symbol;

          return (
            <div
              key={asset.id}
              onClick={() => setSelected(asset.symbol)}
              className={`rounded-[10px] p-3.5 cursor-pointer transition-all relative ${
                isSel
                  ? "bg-dca-panel border border-dca-cyan outline outline-dca-cyan/25"
                  : "bg-dca-card border border-dca-border hover:border-dca-muted"
              }`}
            >
              {pd && (
                <span className="absolute top-2 right-2 text-[9px] text-dca-muted font-mono">
                  {pd.source}
                </span>
              )}
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: TYPE_COLORS[asset.type] + "22",
                    color: TYPE_COLORS[asset.type],
                  }}
                >
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-dca-cyan font-bold text-[13px] font-mono">
                    {asset.symbol}
                  </div>
                  <div className="text-dca-muted text-[10px]">{asset.type}</div>
                </div>
              </div>

              {ld ? (
                <div className="flex items-center gap-2">
                  <Spinner size={14} />
                  <span className="text-dca-muted text-[11px]">
                    Fetching live...
                  </span>
                </div>
              ) : er ? (
                <div>
                  <div className="text-dca-red text-[11px] mb-1">
                    ⚠ Fetch failed
                  </div>
                  <div className="text-dca-muted text-[10px] mb-2 leading-snug">
                    {er.slice(0, 80)}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOne(asset);
                    }}
                    variant="danger"
                    className="text-[10px] px-2 py-0.5"
                  >
                    <Icon name="refresh" size={10} /> Retry
                  </Button>
                </div>
              ) : pd ? (
                <div>
                  <div className="text-[22px] font-bold font-mono text-dca-text">
                    ${fmt(pd.price, pd.price < 100 ? 4 : 2)}
                  </div>
                  <div
                    className={`text-xs mt-0.5 font-mono ${chg >= 0 ? "text-dca-green" : "text-dca-red"}`}
                  >
                    {chg >= 0 ? "▲" : "▼"} $
                    {Math.abs(chg).toFixed(chg < 1 ? 4 : 2)} (
                    {chgP.toFixed(2)}%)
                  </div>
                  <div className="mt-2 text-[10px] text-dca-muted">
                    Avg Cost: ${fmt(asset.averageCost, 2)} ·{" "}
                    <span
                      className={
                        pd.price >= asset.averageCost
                          ? "text-dca-green"
                          : "text-dca-red"
                      }
                    >
                      {pd.price >= asset.averageCost ? "▲" : "▼"}
                      {Math.abs(
                        ((pd.price - asset.averageCost) /
                          asset.averageCost) *
                          100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[22px] font-bold font-mono text-dca-dim">
                    ${fmt(asset.currentPrice)}
                  </div>
                  <div className="text-dca-muted text-[10px] mb-2">
                    Cached price — not live
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOne(asset);
                    }}
                    variant="primary"
                    className="text-[10px] px-2 py-0.5"
                  >
                    <Icon name="signal" size={10} /> Fetch Live
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Chart Panel */}
      {sel && (
        <div className="bg-dca-panel border border-dca-border rounded-[10px] p-6">
          <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-dca-cyan text-2xl font-bold font-mono">
                  {selected}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded text-[11px]"
                  style={{
                    background: TYPE_COLORS[sel.type] + "22",
                    color: TYPE_COLORS[sel.type],
                  }}
                >
                  {sel.type}
                </span>
                {loading[selected] && <Spinner size={16} />}
                {sd && (
                  <span className="text-dca-muted text-[11px] font-mono">
                    via {sd.source}
                  </span>
                )}
              </div>
              <div className="text-dca-muted text-xs mt-1">{sel.name}</div>
            </div>
            {sd && (
              <div className="text-right">
                <div className="text-[30px] font-bold font-mono text-dca-text">
                  ${fmt(sd.price, sd.price < 100 ? 4 : 2)}
                </div>
                <div
                  className={`text-sm font-semibold font-mono ${dc >= 0 ? "text-dca-green" : "text-dca-red"}`}
                >
                  {dc >= 0 ? "▲" : "▼"} $
                  {Math.abs(dc).toFixed(dc < 1 ? 4 : 2)} (
                  {Math.abs(dcp).toFixed(2)}%) today
                </div>
              </div>
            )}
          </div>

          {/* Chart area */}
          <div className="bg-dca-card rounded-[10px] p-4 mb-5">
            {sd?.history && sd.history.length > 1 ? (
              <>
                <PriceChart
                  history={sd.history}
                  symbol={selected}
                  avgCost={sel.averageCost}
                />
                <div className="flex gap-5 mt-2.5 pl-4 text-[11px] text-dca-muted">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-[18px] h-[2.5px] rounded-sm"
                      style={{
                        background:
                          sd.history.at(-1)!.close >= sd.history[0].close
                            ? "var(--color-dca-green)"
                            : "var(--color-dca-red)",
                      }}
                    />
                    Price (90d)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[18px] h-[1.5px] border-t border-dashed border-dca-amber" />
                    Avg Cost (${fmt(sel.averageCost)})
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[180px] flex flex-col items-center justify-center gap-3">
                {loading[selected] ? (
                  <>
                    <Spinner size={28} />
                    <span className="text-dca-muted text-xs">
                      Loading chart data...
                    </span>
                  </>
                ) : errors[selected] ? (
                  <span className="text-dca-red">{errors[selected]}</span>
                ) : (
                  <>
                    <Icon name="chart" size={28} />
                    <span className="text-dca-muted text-xs">
                      Click &quot;Fetch Live&quot; to load chart
                    </span>
                    <Button
                      onClick={() => fetchOne(sel)}
                      variant="primary"
                      className="text-[11px]"
                    >
                      <Icon name="signal" size={12} /> FETCH LIVE DATA
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Stats grid */}
          {sd && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-3">
              {[
                { label: "Open", val: sd.open ? fU(sd.open) : "—" },
                { label: "Day High", val: sd.dayHigh ? fU(sd.dayHigh) : "—" },
                { label: "Day Low", val: sd.dayLow ? fU(sd.dayLow) : "—" },
                {
                  label: "Prev Close",
                  val: sd.previousClose ? fU(sd.previousClose) : "—",
                },
                { label: "Volume", val: sd.volume ? fB(sd.volume) : "—" },
                {
                  label: "Market Cap",
                  val: sd.marketCap ? fB(sd.marketCap) : "—",
                },
                {
                  label: "Your Avg Cost",
                  val: fU(sel.averageCost),
                  color: "text-dca-amber",
                },
                {
                  label: "vs Avg Cost",
                  val: `${sd.price >= sel.averageCost ? "+" : ""}${(((sd.price - sel.averageCost) / sel.averageCost) * 100).toFixed(2)}%`,
                  color:
                    sd.price >= sel.averageCost
                      ? "text-dca-green"
                      : "text-dca-red",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-dca-card border border-dca-border rounded-lg px-3 py-2.5"
                >
                  <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
                    {s.label}
                  </div>
                  <div
                    className={`font-mono text-[15px] font-bold mt-1 ${s.color ?? "text-dca-text"}`}
                  >
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!sd && !loading[selected] && (
            <div className="text-center p-6">
              <Button onClick={() => fetchOne(sel)} variant="primary">
                <Icon name="signal" size={14} /> FETCH LIVE DATA
              </Button>
            </div>
          )}
        </div>
      )}

      {/* API Key Modal */}
      {showKeys && (
        <Modal title="🔑 API KEY CONFIGURATION" onClose={() => setShowKeys(false)}>
          <div className="flex flex-col gap-3.5">
            <div className="bg-dca-card rounded-lg p-3.5 text-[11px] text-dca-muted leading-loose">
              <strong className="text-dca-cyan block mb-1">
                Multi-API Fallback Chain:
              </strong>
              <span className="text-dca-green">① Yahoo Finance</span> — Auto,
              no key needed (stocks/ETF)
              <br />
              <span className="text-dca-green">② CoinGecko</span> — Auto, no
              key needed (crypto only)
              <br />
              <span className="text-dca-amber">③ Finnhub</span> — Optional,
              free at finnhub.io/register
              <br />
              <span className="text-dca-amber">④ Alpha Vantage</span> —
              Optional, free at alphavantage.co
            </div>
            {[
              {
                label: "Finnhub API Key",
                key: "finnhub" as const,
                ph: "d1abc_xxxxxxxxxxxxxxx",
                link: "https://finnhub.io/register",
              },
              {
                label: "Alpha Vantage API Key",
                key: "alphaVantage" as const,
                ph: "ABCDEFGHIJKLMNOP",
                link: "https://www.alphavantage.co/support/#api-key",
              },
            ].map((f) => (
              <div key={f.key}>
                <div className="flex justify-between mb-1.5">
                  <div className="text-[10px] text-dca-muted uppercase tracking-widest font-mono">
                    {f.label}
                  </div>
                  <a
                    href={f.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-dca-cyan text-[10px] no-underline hover:underline"
                  >
                    Get free key →
                  </a>
                </div>
                <input
                  type="text"
                  value={apiKeys[f.key] || ""}
                  placeholder={f.ph}
                  onChange={(e) =>
                    setApiKeys((p) => ({
                      ...p,
                      [f.key]: e.target.value,
                    }))
                  }
                  className="w-full bg-dca-card border border-dca-border rounded-md text-dca-text px-3 py-2 text-[13px] font-mono outline-none focus:border-dca-cyan transition-colors"
                />
              </div>
            ))}
            <div className="p-2.5 bg-dca-card rounded-md text-[10px] text-dca-muted">
              🔒 Keys stored in memory only — not sent to any server other than
              the API providers.
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowKeys(false)}
                variant="primary"
                className="flex-1 justify-center"
              >
                SAVE & CLOSE
              </Button>
              <Button
                onClick={() =>
                  setApiKeys(() => ({ finnhub: "", alphaVantage: "" }))
                }
                variant="ghost"
                className="flex-1 justify-center"
              >
                CLEAR KEYS
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

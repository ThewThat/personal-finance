import type { AppState, AssetType } from "./types";

// ══════════════════════════════════════════════════════════════════════════════
// Design Palette — maps to Tailwind @theme tokens in globals.css
// ══════════════════════════════════════════════════════════════════════════════

export const PALETTE = [
  "#00d4ff",
  "#ff6b35",
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
] as const;

export const TYPE_COLORS: Record<AssetType, string> = {
  ETF: "#00d4ff",
  Stock: "#10b981",
  Crypto: "#f59e0b",
};

// ─── Initial State ──────────────────────────────────────────────────────────

export const initialState: AppState = {
  assets: [
    {
      id: "1",
      symbol: "QQQM",
      name: "Invesco NASDAQ 100 ETF",
      type: "ETF",
      shares: 25,
      averageCost: 168.5,
      currentPrice: 192.3,
      targetAllocation: 40,
    },
    {
      id: "2",
      symbol: "TSM",
      name: "Taiwan Semiconductor",
      type: "Stock",
      shares: 40,
      averageCost: 102.0,
      currentPrice: 145.8,
      targetAllocation: 20,
    },
    {
      id: "3",
      symbol: "VXUS",
      name: "Vanguard Total Intl Stock",
      type: "ETF",
      shares: 60,
      averageCost: 55.0,
      currentPrice: 62.1,
      targetAllocation: 20,
    },
    {
      id: "4",
      symbol: "BTC",
      name: "Bitcoin",
      type: "Crypto",
      shares: 0.15,
      averageCost: 45000,
      currentPrice: 68420,
      targetAllocation: 20,
    },
  ],
  transactions: [
    { id: "t1", assetId: "1", date: "2024-01-01", shares: 10, price: 155.0, type: "BUY" },
    { id: "t2", assetId: "1", date: "2024-02-01", shares: 10, price: 170.0, type: "BUY" },
    { id: "t3", assetId: "1", date: "2024-03-01", shares: 5, price: 180.5, type: "BUY" },
    { id: "t4", assetId: "2", date: "2024-01-15", shares: 20, price: 98.0, type: "BUY" },
    { id: "t5", assetId: "2", date: "2024-03-15", shares: 20, price: 106.0, type: "BUY" },
    { id: "t6", assetId: "3", date: "2024-01-01", shares: 60, price: 55.0, type: "BUY" },
    { id: "t7", assetId: "4", date: "2024-02-10", shares: 0.15, price: 45000, type: "BUY" },
  ],
  dcaConfig: { monthlyAmount: 5000, dayOfMonth: 1, years: 5, expectedReturn: 10 },
  riskFreeRate: 4.5,
};

export const TAB_ITEMS = [
  { id: "prices", lbl: "Live Prices", icon: "signal", badge: "LIVE", href: "/" },
  { id: "portfolio", lbl: "Portfolio", icon: "pie", href: "/portfolio" },
  { id: "dca", lbl: "DCA Sim", icon: "bolt", href: "/dca-sim" },
  { id: "risk", lbl: "Risk", icon: "shield", href: "/risk" },
  { id: "rebalance", lbl: "Rebalance", icon: "refresh", href: "/rebalance" },
  { id: "history", lbl: "History", icon: "history", href: "/history" },
] as const;

export type TabId = (typeof TAB_ITEMS)[number]["id"];

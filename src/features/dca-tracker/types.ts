// ══════════════════════════════════════════════════════════════════════════════
// DCA Portfolio Tracker — Type Definitions
// ══════════════════════════════════════════════════════════════════════════════

export type AssetType = "ETF" | "Stock" | "Crypto";
export type TransactionType = "BUY" | "SELL";
export type RebalanceAction = "BUY" | "SELL" | "HOLD";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  shares: number;
  averageCost: number;
  currentPrice: number;
  targetAllocation: number;
}

export interface Transaction {
  id: string;
  assetId: string;
  date: string;
  shares: number;
  price: number;
  type: TransactionType;
}

export interface DcaConfig {
  monthlyAmount: number;
  dayOfMonth: number;
  years: number;
  expectedReturn: number;
}

export interface AppState {
  assets: Asset[];
  transactions: Transaction[];
  dcaConfig: DcaConfig;
  riskFreeRate: number;
}

// ─── Computed / Derived ─────────────────────────────────────────────────────

export interface PortfolioAsset extends Asset {
  value: number;
  cost: number;
  pnl: number;
  pnlPct: number;
  allocation: number;
  color: string;
}

export interface Portfolio {
  assets: PortfolioAsset[];
  total: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPct: number;
}

export interface DcaScheduleEntry {
  year: number;
  value: number;
  invested: number;
}

export interface DcaResult {
  totalInvested: number;
  futureValue: number;
  profit: number;
  cagr: number;
  schedule: DcaScheduleEntry[];
}

export interface RiskMetrics {
  std: string;
  sharpe: string;
  maxDD: string;
  conc: "HIGH" | "MEDIUM" | "LOW";
  beta: string;
}

export interface RebalanceAsset extends PortfolioAsset {
  diff: number;
  rebalShares: string;
  action: RebalanceAction;
}

// ─── Price Service ──────────────────────────────────────────────────────────

export interface PriceHistory {
  date: string;
  close: number;
}

export interface PriceData {
  symbol: string;
  price: number;
  previousClose?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  marketCap?: number;
  currency?: string;
  exchange?: string;
  dayChange?: number;
  history: PriceHistory[];
  source: string;
}

export interface ApiKeys {
  finnhub: string;
  alphaVantage: string;
}

// ─── Reducer Actions ────────────────────────────────────────────────────────

export type AppAction =
  | { type: "ADD_ASSET"; payload: Omit<Asset, "id"> }
  | { type: "UPDATE_PRICE"; id: string; price: number }
  | { type: "ADD_TX"; payload: Omit<Transaction, "id"> }
  | { type: "UPDATE_DCA"; payload: Partial<DcaConfig> }
  | { type: "UPDATE_TARGET"; id: string; value: number }
  | { type: "DELETE_ASSET"; id: string }
  | { type: "UPDATE_ASSET"; id: string; payload: Partial<Asset> };

// ─── Component Props ────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "danger" | "success" | "ghost";

export interface IconName {
  name:
    | "plus"
    | "trash"
    | "pie"
    | "bolt"
    | "shield"
    | "refresh"
    | "x"
    | "history"
    | "signal"
    | "key"
    | "wifi"
    | "chart"
    | "trend"
    | "edit";
}

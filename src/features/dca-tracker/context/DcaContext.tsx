"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import * as dcaActions from "../dcaSlice";
import type {
  AppState,
  AppAction,
  ApiKeys,
  Portfolio,
  DcaResult,
  RiskMetrics,
  RebalanceAsset,
} from "../types";
import { PALETTE } from "../constants";
import { calcDCA } from "../utils/calculations";

interface DcaContextValue {
  state: AppState;
  dispatch: (action: AppAction) => void;
  port: Portfolio;
  dca: DcaResult;
  risk: RiskMetrics;
  rebal: RebalanceAsset[];
  apiKeys: ApiKeys;
  setApiKeys: (fn: (prev: ApiKeys) => ApiKeys) => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  showTx: boolean;
  setShowTx: (v: boolean) => void;
}

const DcaContext = createContext<DcaContextValue | null>(null);

export function DcaProvider({ children }: { children: ReactNode }) {
  const state = useSelector((s: RootState) => s.dca);
  const reduxDispatch = useDispatch();

  // Legacy dispatch mapper to keep components working
  const dispatch = useCallback((action: AppAction) => {
    switch (action.type) {
      case "ADD_ASSET":
        reduxDispatch(dcaActions.addAsset(action.payload));
        break;
      case "UPDATE_PRICE":
        reduxDispatch(dcaActions.updatePrice({ id: action.id, price: action.price }));
        break;
      case "ADD_TX":
        reduxDispatch(dcaActions.addTransaction(action.payload));
        break;
      case "UPDATE_DCA":
        reduxDispatch(dcaActions.updateDcaConfig(action.payload));
        break;
      case "UPDATE_TARGET":
        reduxDispatch(dcaActions.updateTargetAllocation({ id: action.id, value: action.value }));
        break;
      case "DELETE_ASSET":
        reduxDispatch(dcaActions.deleteAsset(action.id));
        break;
      case "UPDATE_ASSET":
        reduxDispatch(dcaActions.updateAsset({ id: action.id, payload: action.payload }));
        break;
    }
  }, [reduxDispatch]);

  const [apiKeys, setApiKeys] = useState<ApiKeys>({ finnhub: "", alphaVantage: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [showTx, setShowTx] = useState(false);

  const port: Portfolio = useMemo(() => {
    const tot = state.assets.reduce((s, a) => s + a.currentPrice * a.shares, 0);
    const tc = state.assets.reduce((s, a) => s + a.averageCost * a.shares, 0);
    const assets = state.assets.map((a, i) => {
      const v = a.currentPrice * a.shares;
      const c = a.averageCost * a.shares;
      return {
        ...a,
        value: v,
        cost: c,
        pnl: v - c,
        pnlPct: ((a.currentPrice - a.averageCost) / a.averageCost) * 100,
        allocation: tot > 0 ? (v / tot) * 100 : 0,
        color: PALETTE[i % PALETTE.length],
      };
    });
    return {
      assets,
      total: tot,
      totalCost: tc,
      totalPnl: tot - tc,
      totalPnlPct: tc > 0 ? ((tot - tc) / tc) * 100 : 0,
    };
  }, [state.assets]);

  const dca = useMemo(
    () =>
      calcDCA(
        state.dcaConfig.monthlyAmount,
        state.dcaConfig.years,
        state.dcaConfig.expectedReturn
      ),
    [state.dcaConfig]
  );

  const risk: RiskMetrics = useMemo(() => {
    const rets = port.assets.map((a) => a.pnlPct);
    const avg = rets.reduce((s, r) => s + r, 0) / (rets.length || 1);
    const std = Math.sqrt(
      rets.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / (rets.length || 1)
    );
    const sharpe =
      std === 0 ? "0" : ((avg - state.riskFreeRate) / std).toFixed(2);
    const top = Math.max(...port.assets.map((a) => a.allocation));
    return {
      std: std.toFixed(2),
      sharpe,
      maxDD: "8.4",
      conc: (top > 40 ? "HIGH" : top > 25 ? "MEDIUM" : "LOW") as
        | "HIGH"
        | "MEDIUM"
        | "LOW",
      beta: "0.92",
    };
  }, [port, state.riskFreeRate]);

  const rebal: RebalanceAsset[] = useMemo(
    () =>
      port.assets.map((a) => {
        const tv = port.total * (a.targetAllocation / 100);
        const diff = tv - a.value;
        return {
          ...a,
          diff,
          rebalShares: Math.abs(diff / a.currentPrice).toFixed(3),
          action: (diff > 50 ? "BUY" : diff < -50 ? "SELL" : "HOLD") as
            | "BUY"
            | "SELL"
            | "HOLD",
        };
      }),
    [port]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      port,
      dca,
      risk,
      rebal,
      apiKeys,
      setApiKeys,
      showAdd,
      setShowAdd,
      showTx,
      setShowTx,
    }),
    [state, port, dca, risk, rebal, apiKeys, showAdd, showTx, dispatch, setShowAdd, setShowTx]
  );

  return <DcaContext.Provider value={value}>{children}</DcaContext.Provider>;
}

export function useDca() {
  const ctx = useContext(DcaContext);
  if (!ctx) throw new Error("useDca must be used within DcaProvider");
  return ctx;
}

"use client";

import { useState, type FC, type Dispatch } from "react";
import type { AppAction, Asset, TransactionType } from "../types";
import { fU } from "../utils/formatters";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface LogTransactionModalProps {
  onClose: () => void;
  dispatch: Dispatch<AppAction>;
  assets: Asset[];
}

interface TxForm {
  assetId: string; date: string; shares: string; price: string; type: TransactionType;
}

export const LogTransactionModal: FC<LogTransactionModalProps> = ({ onClose, dispatch, assets }) => {
  const [form, setForm] = useState<TxForm>({ assetId: "", date: "", shares: "", price: "", type: "BUY" });

  const handleLog = () => {
    if (!form.assetId || !form.shares) return;
    dispatch({ type: "ADD_TX", payload: { assetId: form.assetId, date: form.date, shares: +form.shares, price: +form.price, type: form.type } });
    onClose();
  };

  const inputCls = "w-full bg-dca-card border border-dca-border rounded-md text-dca-text px-3 py-2 text-[13px] font-mono outline-none focus:border-dca-cyan transition-colors";
  const labelCls = "text-[9px] text-dca-muted uppercase tracking-widest font-mono mb-1.5 block";

  return (
    <Modal title="LOG TRANSACTION" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>
          <label className={labelCls}>ASSET</label>
          <select value={form.assetId} onChange={e => setForm(p => ({ ...p, assetId: e.target.value }))} className={inputCls}>
            <option value="">-- Select --</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.symbol} — {a.name}</option>)}
          </select>
        </div>
        {([
          { l: "Date", k: "date" as const, t: "date" },
          { l: "Shares", k: "shares" as const, t: "number" },
          { l: "Price per Share (USD)", k: "price" as const, t: "number" },
        ]).map(f => (
          <div key={f.k}>
            <label className={labelCls}>{f.l}</label>
            <input type={f.t} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} className={inputCls} />
          </div>
        ))}
        <div>
          <label className={labelCls}>TYPE</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TransactionType }))} className={inputCls}>
            <option>BUY</option><option>SELL</option>
          </select>
        </div>
        {form.shares && form.price && (
          <div className="bg-dca-card p-2.5 rounded-md text-xs">
            Total: <strong className="text-dca-cyan">{fU(+form.shares * +form.price)}</strong>
          </div>
        )}
        <div className="flex gap-2 mt-1.5">
          <Button onClick={handleLog} variant="primary" className="flex-1 justify-center">LOG</Button>
          <Button onClick={onClose} variant="ghost" className="flex-1 justify-center">CANCEL</Button>
        </div>
      </div>
    </Modal>
  );
};

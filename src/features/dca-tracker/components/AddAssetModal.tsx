"use client";

import { useState, type FC, type Dispatch } from "react";
import type { AppAction } from "../types";
import type { AssetType } from "../types";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface AddAssetModalProps {
  onClose: () => void;
  dispatch: Dispatch<AppAction>;
}

interface NewAssetForm {
  symbol: string;
  name: string;
  type: AssetType;
  shares: string;
  averageCost: string;
  currentPrice: string;
  targetAllocation: string;
}

const emptyForm: NewAssetForm = {
  symbol: "", name: "", type: "ETF",
  shares: "", averageCost: "", currentPrice: "", targetAllocation: "",
};

export const AddAssetModal: FC<AddAssetModalProps> = ({ onClose, dispatch }) => {
  const [form, setForm] = useState<NewAssetForm>(emptyForm);

  const handleAdd = () => {
    if (!form.symbol) return;
    dispatch({
      type: "ADD_ASSET",
      payload: {
        symbol: form.symbol, name: form.name, type: form.type,
        shares: +form.shares, averageCost: +form.averageCost,
        currentPrice: +form.currentPrice, targetAllocation: +form.targetAllocation,
      },
    });
    onClose();
  };

  const inputCls = "w-full bg-dca-card border border-dca-border rounded-md text-dca-text px-3 py-2 text-[13px] font-mono outline-none focus:border-dca-cyan transition-colors";
  const labelCls = "text-[9px] text-dca-muted uppercase tracking-widest font-mono mb-1.5 block";

  return (
    <Modal title="ADD NEW ASSET" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {([
          {l:"Symbol",k:"symbol" as const,t:"text",ph:"AAPL, BTC..."},
          {l:"Full Name",k:"name" as const,t:"text",ph:"Apple Inc."},
          {l:"Shares",k:"shares" as const,t:"number",ph:""},
          {l:"Avg Cost (USD)",k:"averageCost" as const,t:"number",ph:""},
          {l:"Current Price (USD)",k:"currentPrice" as const,t:"number",ph:""},
          {l:"Target Allocation (%)",k:"targetAllocation" as const,t:"number",ph:""},
        ]).map(f=>(
          <div key={f.k}>
            <label className={labelCls}>{f.l}</label>
            <input type={f.t} placeholder={f.ph} value={form[f.k]}
              onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} className={inputCls}/>
          </div>
        ))}
        <div>
          <label className={labelCls}>TYPE</label>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as AssetType}))} className={inputCls}>
            <option>ETF</option><option>Stock</option><option>Crypto</option>
          </select>
        </div>
        <div className="flex gap-2 mt-1.5">
          <Button onClick={handleAdd} variant="primary" className="flex-1 justify-center">ADD ASSET</Button>
          <Button onClick={onClose} variant="ghost" className="flex-1 justify-center">CANCEL</Button>
        </div>
      </div>
    </Modal>
  );
};

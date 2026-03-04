import type { FC } from "react";
import { TYPE_COLORS } from "../constants";
import { fmt, fU } from "../utils/formatters";
import { Icon } from "./Icon";
import { Button } from "./Button";

import { useDca } from "../context/DcaContext";

export const HistoryTab: FC = () => {
  const { state, setShowTx } = useDca();
  const { transactions, assets } = state;
  const onLogTransaction = () => setShowTx(true);

  return (
  <div className="flex flex-col gap-[18px]">
    <div className="flex justify-between items-center">
      <span className="text-dca-muted font-mono text-[13px] uppercase tracking-wider">
        TRANSACTION HISTORY · {transactions.length} RECORDS
      </span>
      <Button onClick={onLogTransaction} variant="primary" className="text-[11px] px-2.5 py-1">
        <Icon name="plus" size={11} /> LOG TRANSACTION
      </Button>
    </div>
    <div className="bg-dca-panel border border-dca-border rounded-[10px] p-5">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-dca-border">
            {["Date","Symbol","Type","Action","Shares","Price","Total"].map(h=>(
              <th key={h} className={`text-[9px] text-dca-muted uppercase tracking-widest font-mono font-normal px-3 py-1.5 ${h==="Date"?"text-left":"text-right"}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...transactions].reverse().map(tx=>{
            const asset=assets.find(a=>a.id===tx.assetId);
            return(
              <tr key={tx.id} className="border-b border-dca-panel">
                <td className="px-3 py-2 text-dca-muted">{tx.date}</td>
                <td className="px-3 py-2 text-right text-dca-cyan font-bold">{asset?.symbol??"?"}</td>
                <td className="px-3 py-2 text-right">
                  {asset&&<span className="px-1.5 py-0.5 rounded text-[10px]" style={{background:TYPE_COLORS[asset.type]+"22",color:TYPE_COLORS[asset.type]}}>{asset.type}</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={`font-bold ${tx.type==="BUY"?"text-dca-green":"text-dca-red"}`}>{tx.type}</span>
                </td>
                <td className="px-3 py-2 text-right text-dca-muted">{fmt(tx.shares,4)}</td>
                <td className="px-3 py-2 text-right text-dca-muted">{fU(tx.price)}</td>
                <td className="px-3 py-2 text-right font-bold">{fU(tx.price*tx.shares)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
};



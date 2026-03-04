"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { DcaProvider, useDca } from "@/features/dca-tracker/context/DcaContext";
import { Icon } from "@/features/dca-tracker/components/Icon";
import { ThemeToggle } from "@/features/dca-tracker/components/ThemeToggle";
import { TAB_ITEMS } from "@/features/dca-tracker/constants";
import { fU } from "@/features/dca-tracker/utils/formatters";
import { AddAssetModal } from "@/features/dca-tracker/components/AddAssetModal";
import { LogTransactionModal } from "@/features/dca-tracker/components/LogTransactionModal";

import { useSession, signOut } from "next-auth/react";

function DcaLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { port, showAdd, setShowAdd, showTx, setShowTx, dispatch, state } = useDca();
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-dca-bg text-dca-text font-mono">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-9999"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,212,255,.01) 3px,rgba(0,212,255,.01) 4px)" }} />

      {/* Header */}
      <header className="border-b border-dca-border px-4 sm:px-6 flex items-center justify-between h-14 bg-dca-panel sticky top-0 z-100 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] bg-linear-to-br from-sky-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/10">
            <Icon name="trend" size={14} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-bold text-[13px] sm:text-[15px] tracking-widest text-dca-cyan">DCA.TRACK</span>
            <span className="text-dca-dim text-[8px] sm:text-[10px] hidden xs:inline uppercase tracking-tighter">v2.2</span>
          </div>
        </div>
        
        <div className="flex gap-3 sm:gap-6 items-center">
          <div className="hidden xs:flex gap-4 sm:gap-6 items-center">
            <div className="text-right">
              <div className="text-[8px] sm:text-[9px] text-dca-muted tracking-wider uppercase">Value</div>
              <div className="text-xs sm:text-lg font-bold text-dca-cyan font-mono">{fU(port.total)}</div>
            </div>
            <div className="w-px h-8 bg-dca-border" />
            <div className="text-right">
              <div className="text-[8px] sm:text-[9px] text-dca-muted tracking-wider uppercase">P/L</div>
              <div className={`text-[10px] sm:text-[15px] font-bold font-mono ${port.totalPnl >= 0 ? "text-dca-green" : "text-dca-red"}`}>
                {port.totalPnl >= 0 ? "+" : ""}{fU(port.totalPnl)}
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-dca-border ml-2" />
          
          <div className="flex items-center gap-3">
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] font-bold text-dca-text truncate max-w-[100px]">{session.user?.name}</span>
                  <button 
                    onClick={() => signOut()}
                    className="text-[9px] text-dca-muted hover:text-dca-red transition-colors uppercase font-bold tracking-tighter"
                  >
                    Logout
                  </button>
                </div>
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="profile" 
                    className="w-8 h-8 rounded-full border border-dca-border hover:border-dca-cyan transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-dca-card border border-dca-border flex items-center justify-center text-[10px] text-dca-muted">
                    {session.user?.name?.[0]}
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" 
                className="bg-dca-cyan/10 border border-dca-cyan/30 text-dca-cyan px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold hover:bg-dca-cyan hover:text-dca-bg transition-all uppercase tracking-wider"
              >
                Login
              </Link>
            )}
            <div className="w-px h-8 bg-dca-border hidden xs:block" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-dca-border px-5 flex gap-px overflow-x-auto bg-dca-panel/50 backdrop-blur-md sticky top-14 z-90 transition-colors">
        {TAB_ITEMS.map(t => {
          const isActive = pathname === t.href;
          return (
            <Link key={t.id} href={t.href}
              className={`bg-transparent border-none cursor-pointer font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all px-3.5 py-[11px] ${
                isActive
                  ? "text-dca-cyan border-b-2 border-dca-cyan"
                  : "text-dca-muted border-b-2 border-transparent hover:text-dca-text"
              }`}
            >
              <Icon name={t.icon} size={12} /> {t.lbl.toUpperCase()}
              {"badge" in t && t.badge && (
                <span className="bg-dca-green/20 text-dca-green text-[9px] px-1.5 py-px rounded-full">{t.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <main className="p-4 sm:p-5 sm:px-6 max-w-[1440px] mx-auto min-h-[calc(100vh-112px)]">
        {children}
      </main>

      {showAdd && <AddAssetModal onClose={() => setShowAdd(false)} dispatch={dispatch} />}
      {showTx && <LogTransactionModal onClose={() => setShowTx(false)} dispatch={dispatch} assets={state.assets} />}
    </div>
  );
}

export default function DcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DcaProvider>
      <DcaLayoutContent>{children}</DcaLayoutContent>
    </DcaProvider>
  );
}

"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/features/dca-tracker/components/Icon";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dca-bg flex items-center justify-center font-mono">
        <div className="animate-pulse text-dca-cyan tracking-widest uppercase text-xs">Loading Security Context...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dca-bg flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-dca-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-20"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,212,255,.05) 3px,rgba(0,212,255,.05) 4px)" }} />

      <div className="w-full max-w-[420px] bg-dca-panel border border-dca-border rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-3xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-[60px] h-[60px] bg-linear-to-br from-sky-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20">
            <Icon name="trend" size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-dca-cyan mb-2">DCA.TRACK</h1>
          <p className="text-dca-muted text-xs tracking-wider uppercase">Advanced Portfolio v2.2</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-dca-text mb-2">Welcome Back</h2>
            <p className="text-dca-dim text-[13px] leading-relaxed">
              Authenticate via Google to access and sync your investment portfolio securely across devices.
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-dca-card border border-dca-border hover:border-dca-cyan hover:bg-dca-bg transition-all py-3.5 rounded-xl text-[14px] font-bold tracking-wide group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56,12.25c0-0.78-0.07-1.53-0.2-2.25H12v4.26h5.92c-0.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57C21.35,18.41,22.56,15.62,22.56,12.25z" fill="#4285F4"/>
              <path d="M12,23c2.97,0,5.46-0.98,7.28-2.66l-3.57-2.77c-0.99,0.66-2.26,1.06-3.71,1.06c-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23z" fill="#34A853"/>
              <path d="M5.84,14.09c-0.22-0.66-0.35-1.36-0.35-2.09s0.13-1.43,0.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s0.43,3.45,1.18,4.93L5.84,14.09z" fill="#FBBC05"/>
              <path d="M12,5.38c1.62,0,3.06,0.56,4.21,1.66l3.15-3.15C17.45,2.09,14.97,1,12,1C7.7,1,3.99,3.47,2.18,7.07l3.66,2.84C6.71,7.31,9.14,5.38,12,5.38z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-dca-border/50 text-center">
          <p className="text-[10px] text-dca-muted uppercase tracking-[0.2em]">
            Secure Encryption Enabled
          </p>
        </div>
      </div>
    </div>
  );
}

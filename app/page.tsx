"use client";
import React from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { BalanceLedger } from "@/components/BalanceLedger";
import { TransferPanel } from "@/components/TransferPanel";
import { useEnsureArcTestnet } from "@/hooks/useEnsureArcTestnet";
import { getPrimaryChain } from "@/config/chains";
export default function Home() {
  useEnsureArcTestnet();
  const primary = getPrimaryChain();
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold bg-brand-gradient bg-clip-text text-transparent">ArcShift</span>
          <span className="text-xs bg-ink border border-line-strong text-brand-light px-2 py-0.5 rounded-full">TESTNET</span>
        </div>
        <ConnectButton />
      </nav>
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white leading-tight mb-3">Bridge USDC, instantly.</h1>
        <p className="text-muted text-base max-w-lg leading-relaxed">Send USDC from Arc Testnet to any supported chain with one click. Approve, deposit, sign, and mint handled automatically.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="font-display text-2xl font-bold text-white">5</div>
          <div className="text-xs text-muted mt-1">Chains supported</div>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="font-display text-2xl font-bold text-white">1-click</div>
          <div className="text-xs text-muted mt-1">Bridge experience</div>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="font-display text-2xl font-bold text-white">0</div>
          <div className="text-xs text-muted mt-1">Bridge fees</div>
        </div>
      </div>
      <div className="space-y-4">
        <BalanceLedger />
        <TransferPanel />
      </div>
      <footer className="mt-10 pt-6 border-t border-line flex items-center justify-between">
        <span className="text-xs text-muted">Testnet only. No real funds.</span>
        <a href={primary.faucetUrl} target="_blank" rel="noreferrer" className="text-xs text-brand hover:text-brand-light transition-colors">Get testnet USDC</a>
      </footer>
    </main>
  );
}

"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { BalanceLedger } from "@/components/BalanceLedger";
import { DepositPanel } from "@/components/DepositPanel";
import { TransferPanel } from "@/components/TransferPanel";
import { NetworkGuard } from "@/components/NetworkGuard";
import { ToastProvider } from "@/components/Toast";
import { getPrimaryChain } from "@/config/chains";

export default function Home() {
  const primary = getPrimaryChain();

  return (
    <ToastProvider>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-action" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted">
              {primary.label} · Testnet
            </span>
          </div>
          <ConnectButton />
        </header>

        <h1 className="font-mono text-3xl font-semibold mt-8 mb-2">
          Unified Balance
        </h1>
        <p className="text-muted mb-10 max-w-lg">
          Hold USDC on {primary.label}, deposit it into Gateway, and send it
          to any supported chain from a single balance.
        </p>

        <div className="space-y-6">
          <NetworkGuard />
          <BalanceLedger />
          <DepositPanel />
          <TransferPanel />
        </div>

        <footer className="mt-12 pt-6 border-t border-line text-xs text-muted">
          Testnet only. No real funds are used. Faucet:{" "}
          <a
            href={primary.faucetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-action hover:underline"
          >
            faucet.circle.com
          </a>
        </footer>
      </main>
    </ToastProvider>
  );
}

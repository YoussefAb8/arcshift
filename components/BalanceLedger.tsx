"use client";

import { useAccount } from "wagmi";
import { useUsdcBalance } from "@/hooks/useUsdcBalance";
import { getPrimaryChain } from "@/config/chains";

export function BalanceLedger() {
  const { address, isConnected } = useAccount();
  const primary = getPrimaryChain();
  const balance = useUsdcBalance(address);

  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-8 text-center">
        <div className="text-4xl mb-3">🔌</div>
        <p className="text-muted text-sm">
          Connect your wallet to view your USDC balance on {primary.label}.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl border border-line bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-card-gradient pointer-events-none" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted mb-3">
            Your balance
          </div>
          <div className="font-display text-4xl font-bold text-white leading-none mb-1">
            {balance.isLoading ? "—" : balance.erc20Formatted}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-muted-light text-sm">USDC</span>
            
              href={primary.faucetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand hover:text-brand-light transition-colors"
            >
              Get testnet USDC →
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-line">
            <div className="text-xs text-muted mb-2">Connected network</div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-brand-light font-medium">
                {primary.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-card-gradient pointer-events-none" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted mb-3">
            Gas balance
          </div>
          <div className="font-display text-2xl font-bold text-white leading-none mb-1">
            {balance.isLoading ? "—" : Number(balance.nativeFormatted).toFixed(4)}
          </div>
          <div className="text-muted-light text-sm mt-1">Native USDC</div>
          <div className="mt-4 pt-4 border-t border-line">
            <div className="text-xs text-muted mb-2">Explorer</div>
            
              href={`${primary.explorerUrl}/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand hover:text-brand-light transition-colors"
            >
              View on {primary.label} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

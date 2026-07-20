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
        <p className="text-muted text-sm">
          Connect a wallet to view your balance on {primary.label}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-8">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-wider text-muted">
          Available on {primary.label}
        </span>
        
          href={primary.faucetUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-action hover:underline"
        >
          Get testnet USDC
        </a>
      </div>
      <div className="flex items-end gap-2 mb-6">
        <span className="font-mono text-4xl font-semibold tabular-nums">
          {balance.isLoading ? "—" : balance.erc20Formatted}
        </span>
        <span className="text-muted text-lg pb-0.5">USDC</span>
      </div>
      <div className="text-sm">
        <div className="text-muted text-xs mb-1">Native gas balance</div>
        <div className="font-mono">
          {balance.isLoading ? "—" : balance.nativeFormatted} USDC
        </div>
      </div>
    </div>
  );
}

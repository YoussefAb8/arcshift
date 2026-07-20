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
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-muted">
          Your Balance
        </span>
        <a href={primary.faucetUrl} target="_blank" rel="noreferrer" className="text-xs text-action hover:underline">
          Get Testnet USDC
        </a>
      </div>

      <div className="flex items-end gap-2">
        <span className="font-mono text-5xl font-semibold">
          {balance.isLoading ? "—" : balance.erc20Formatted}
        </span>
        <span className="text-muted mb-2">USDC</span>
      </div>
    </div>
  );
}

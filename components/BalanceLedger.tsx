"use client";

import { useAccount } from "wagmi";
import { useUsdcBalance } from "@/hooks/useUsdcBalance";
import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { getPrimaryChain } from "@/config/chains";

export function BalanceLedger() {
  const { address, isConnected } = useAccount();
  const primary = getPrimaryChain();
  const balance = useUsdcBalance(address);
  const unified = useUnifiedBalance(address);

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
        <a
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

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <div className="text-muted text-xs mb-1">Native gas balance</div>
          <div className="font-mono">
            {balance.isLoading ? "—" : balance.nativeFormatted} USDC
          </div>
        </div>
        <div>
          <div className="text-muted text-xs mb-1">Unified Balance total</div>
          <div className="font-mono">
            {unified.isLoading ? "—" : unified.totalFormatted} USDC
          </div>
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <div className="text-xs uppercase tracking-wider text-muted mb-3">
          Unified Balance by chain
        </div>
        {unified.error && (
          <p className="text-danger text-sm">{unified.error}</p>
        )}
        <ul className="space-y-2">
          {unified.entries.map((entry) => (
            <li
              key={entry.key}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-paper/80">{entry.label}</span>
              <span className="font-mono tabular-nums">
                {entry.formatted} USDC
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

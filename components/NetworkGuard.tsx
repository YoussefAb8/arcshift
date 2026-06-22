"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { getPrimaryChain } from "@/config/chains";

export function NetworkGuard() {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const primary = getPrimaryChain();

  if (!isConnected) return null;
  if (chain?.id === primary.chain.id) return null;

  return (
    <div className="rounded-xl border border-pending/40 bg-pending/10 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-pending">
        Your wallet is connected to {chain?.name ?? "an unknown network"}.
        This app runs on {primary.label}.
      </p>
      <button
        onClick={() => switchChain({ chainId: primary.chain.id })}
        disabled={isPending}
        className="rounded-full bg-pending px-4 py-1.5 text-sm font-semibold text-ink whitespace-nowrap disabled:opacity-50"
      >
        {isPending ? "Switching…" : `Switch to ${primary.label}`}
      </button>
    </div>
  );
}

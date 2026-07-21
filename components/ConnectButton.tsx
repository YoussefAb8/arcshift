"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

function truncate(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-line-strong bg-panel px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-success glow-pulse" />
          <span className="font-mono text-sm text-paper">
            {truncate(address)}
          </span>
          {chain && (
            <span className="text-xs text-brand-light border-l border-line pl-2 ml-1">
              {chain.name}
            </span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="text-sm text-muted hover:text-paper transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const injectedConnector = connectors.find((c) => c.id === "injected");

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={isPending}
      className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}

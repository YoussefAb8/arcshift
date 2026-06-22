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
        <div className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="font-mono text-sm text-paper">
            {truncate(address)}
          </span>
          {chain && (
            <span className="text-xs text-muted border-l border-line pl-2 ml-1">
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
      className="rounded-full bg-action px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-action-dim disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}

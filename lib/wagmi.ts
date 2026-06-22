/**
 * lib/wagmi.ts
 *
 * Wagmi is the library that manages "connect wallet," "which network is
 * the user on," and "send this transaction" for us. This file builds the
 * one configuration object the whole app shares.
 *
 * IMPORTANT: every chain the app might ever ask the wallet to switch to
 * (Arc Testnet AND every Gateway destination chain) must be listed here.
 * If a chain is missing, wagmi throws "Chain not configured" the moment
 * switchChain() is called for it -- it has no information about chains
 * that aren't in this list, even if they're well-known public networks.
 */
"use client";

import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import type { Chain } from "viem";
import { SUPPORTED_CHAINS, getPrimaryChain } from "@/config/chains";

const primary = getPrimaryChain();
const allChains = Object.values(SUPPORTED_CHAINS).map((c) => c.chain);

// wagmi's types require the chains array to be a non-empty tuple
// ([Chain, ...Chain[]]). config/chains.ts is guaranteed to define at
// least one chain (Arc Testnet), so this cast is safe.
const chainsTuple = allChains as [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  chains: chainsTuple,
  connectors: [
    injected(), // Detects MetaMask or any other browser-injected wallet
  ],
  transports: Object.fromEntries(allChains.map((c) => [c.id, http()])),
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

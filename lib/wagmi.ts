"use client";

import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import type { Chain } from "viem";
import {
  arcTestnet,
  sepoliaTestnet,
  baseSepoliaTestnet,
  arbitrumSepoliaTestnet,
  optimismSepoliaTestnet,
  polygonAmoyTestnet,
} from "@/config/chains";

const allChains: Chain[] = [
  arcTestnet,
  sepoliaTestnet,
  baseSepoliaTestnet,
  arbitrumSepoliaTestnet,
  optimismSepoliaTestnet,
  polygonAmoyTestnet,
];

const chainsTuple = allChains as [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  chains: chainsTuple,
  connectors: [injected()],
  transports: Object.fromEntries(allChains.map((c) => [c.id, http()])),
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

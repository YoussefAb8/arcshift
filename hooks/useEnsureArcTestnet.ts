"use client";

import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { getPrimaryChain } from "@/config/chains";

export function useEnsureArcTestnet() {
  const { isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chain && chain.id !== getPrimaryChain().chain.id) {
      switchChainAsync({ chainId: getPrimaryChain().chain.id }).catch(() => {
        // Silent fail if user rejects
      });
    }
  }, [isConnected, chain]);
}

/**
 * hooks/useUsdcBalance.ts
 *
 * Reads the user's USDC balance on Arc Testnet two ways:
 *  - native balance (used for gas, 18-decimal internal precision)
 *  - ERC-20 balance via balanceOf (used for app-level transfers, 6-decimal)
 * On Arc these represent the SAME underlying funds, kept in sync by a
 * precompile. We show both so the user understands this and never assumes
 * they have "two pools of USDC."
 */
"use client";

import { useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { ERC20_ABI, getPrimaryChain } from "@/config/chains";
import { formatUsdcAmount } from "@/lib/usdc";

export function useUsdcBalance(address: `0x${string}` | undefined) {
  const primary = getPrimaryChain();

  const nativeBalance = useBalance({
    address,
    chainId: primary.chain.id,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const erc20Balance = useReadContract({
    address: primary.usdcAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: primary.chain.id,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  return {
    nativeFormatted: nativeBalance.data
      ? formatEther(nativeBalance.data.value)
      : "0.0",
    erc20Raw: (erc20Balance.data as bigint | undefined) ?? 0n,
    erc20Formatted: erc20Balance.data
      ? formatUsdcAmount(erc20Balance.data as bigint)
      : "0.00",
    isLoading: nativeBalance.isLoading || erc20Balance.isLoading,
    refetch: () => {
      void nativeBalance.refetch();
      void erc20Balance.refetch();
    },
  };
}

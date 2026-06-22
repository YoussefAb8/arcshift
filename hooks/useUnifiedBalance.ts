/**
 * hooks/useUnifiedBalance.ts
 *
 * Fetches the user's Gateway Unified Balance (USDC deposited into the
 * Gateway protocol, spendable across any supported chain) by calling our
 * own /api/gateway/balance route, which proxies Circle's API.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { SUPPORTED_CHAINS } from "@/config/chains";
import { formatUsdcAmount, parseUsdcAmount } from "@/lib/usdc";

export interface UnifiedBalanceEntry {
  key: string;
  label: string;
  domainId: number;
  raw: bigint;
  formatted: string;
}

export function useUnifiedBalance(address: `0x${string}` | undefined) {
  const [entries, setEntries] = useState<UnifiedBalanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!address) {
      setEntries([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gateway/balance?address=${address}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load Unified Balance");
      }
      const balances: Array<{ domain: number; balance: string }> =
        data.balances ?? [];

      const mapped: UnifiedBalanceEntry[] = Object.entries(SUPPORTED_CHAINS).map(
        ([key, cfg]) => {
          const match = balances.find((b) => b.domain === cfg.domainId);
          // Circle's Gateway API returns balance as a decimal string like
          // "10.000000" (human-readable USDC), NOT raw integer base units.
          // BigInt() can only parse whole-number strings, so we must use
          // parseUsdcAmount() to correctly convert the decimal into base units.
          const raw = match ? parseUsdcAmount(match.balance) : 0n;
          return {
            key,
            label: cfg.label,
            domainId: cfg.domainId,
            raw,
            formatted: formatUsdcAmount(raw),
          };
        },
      );
      setEntries(mapped);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const total = entries.reduce((sum, e) => sum + e.raw, 0n);

  return {
    entries,
    total,
    totalFormatted: formatUsdcAmount(total),
    isLoading,
    error,
    refetch,
  };
}

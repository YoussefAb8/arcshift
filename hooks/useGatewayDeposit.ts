/**
 * hooks/useGatewayDeposit.ts
 *
 * Orchestrates step 1 of the Gateway flow: approve + deposit USDC from
 * Arc Testnet into the Gateway Wallet contract. Exposes a status string
 * so the UI can show exactly which on-chain step is in progress.
 */
"use client";

import { useState } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import {
  ERC20_ABI,
  GATEWAY_WALLET_ABI,
  GATEWAY_WALLET_ADDRESS,
  getPrimaryChain,
} from "@/config/chains";

export type DepositStatus =
  | "idle"
  | "approving"
  | "approved"
  | "depositing"
  | "complete"
  | "error";

export function useGatewayDeposit() {
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHashes, setTxHashes] = useState<{
    approve?: `0x${string}`;
    deposit?: `0x${string}`;
  }>({});

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function deposit(amount: bigint) {
    const primary = getPrimaryChain();
    setErrorMessage(null);
    setTxHashes({});

    try {
      setStatus("approving");
      const approveHash = await writeContractAsync({
        address: primary.usdcAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [GATEWAY_WALLET_ADDRESS, amount],
      });
      setTxHashes((prev) => ({ ...prev, approve: approveHash }));

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
          timeout: 180_000,
          pollingInterval: 4_000,
        });
      }
      setStatus("approved");

      setStatus("depositing");
      const depositHash = await writeContractAsync({
        address: GATEWAY_WALLET_ADDRESS,
        abi: GATEWAY_WALLET_ABI,
        functionName: "deposit",
        args: [primary.usdcAddress, amount],
      });
      setTxHashes((prev) => ({ ...prev, deposit: depositHash }));

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({
          hash: depositHash,
          timeout: 180_000,
          pollingInterval: 4_000,
        });
      }
      setStatus("complete");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        (err as Error).message ?? "The deposit could not be completed",
      );
    }
  }

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
    setTxHashes({});
  }

  return { status, errorMessage, txHashes, deposit, reset };
}

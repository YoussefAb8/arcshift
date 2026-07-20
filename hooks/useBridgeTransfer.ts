/**
 * hooks/useBridgeTransfer.ts
 *
 * Unified bridge flow: combines approve + deposit + sign burn intent +
 * attest + mint into ONE seamless operation from the user's perspective.
 */
"use client";

import { useState } from "react";
import { useWriteContract, useSwitchChain, usePublicClient } from "wagmi";
import { buildBurnIntentTypedData, submitBurnIntent } from "@/lib/gateway";
import {
  ERC20_ABI,
  GATEWAY_WALLET_ABI,
  GATEWAY_WALLET_ADDRESS,
  GATEWAY_MINTER_ABI,
  GATEWAY_MINTER_ADDRESS,
  SUPPORTED_CHAINS,
  PRIMARY_CHAIN_KEY,
  getPrimaryChain,
} from "@/config/chains";
import { getPublicClient } from "wagmi/actions";
import { wagmiConfig } from "@/lib/wagmi";
import type { Chain } from "viem";

export type BridgeStatus =
  | "idle"
  | "approving"
  | "depositing"
  | "signing"
  | "attesting"
  | "switching-network"
  | "minting"
  | "complete"
  | "error";

export interface BridgeParams {
  destinationChainKey: string;
  recipientAddress: `0x${string}`;
  amount: bigint;
  depositorAddress: `0x${string}`;
  signTypedDataAsync: (args: unknown) => Promise<`0x${string}`>;
}

export function useBridgeTransfer() {
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  async function bridge(params: BridgeParams) {
    setErrorMessage(null);
    setTxHash(null);

    try {
      const source = SUPPORTED_CHAINS[PRIMARY_CHAIN_KEY]!;
      const destination = SUPPORTED_CHAINS[params.destinationChainKey];
      if (!destination) {
        throw new Error("Unknown destination chain selected");
      }

      // STEP 1: Approve (if needed)
      setStatus("approving");
      await writeContractAsync({
        address: source.usdcAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [GATEWAY_WALLET_ADDRESS, params.amount],
      });

      // STEP 2: Deposit into Gateway Wallet (automatic, not shown separately to user)
      setStatus("depositing");
      await writeContractAsync({
        address: GATEWAY_WALLET_ADDRESS,
        abi: GATEWAY_WALLET_ABI,
        functionName: "deposit",
        args: [source.usdcAddress, params.amount],
      });

      // STEP 3: Sign burn intent (user signs in wallet)
      setStatus("signing");
      const typedData = buildBurnIntentTypedData({
        sourceDomainId: source.domainId,
        destinationDomainId: destination.domainId,
        sourceUsdcAddress: source.usdcAddress,
        destinationUsdcAddress: destination.usdcAddress,
        depositorAddress: params.depositorAddress,
        recipientAddress: params.recipientAddress,
        amount: params.amount,
      });

      const signature = await params.signTypedDataAsync(typedData);

      // STEP 4: Get attestation from Gateway API
      setStatus("attesting");
      const attestationResult = await submitBurnIntent(
        typedData.message,
        signature,
      );

      // STEP 5: Switch network if needed
      if (destination.chain.id !== source.chain.id) {
        setStatus("switching-network");
        await switchChainAsync({ chainId: destination.chain.id });
      }

      // STEP 6: Mint on destination
      setStatus("minting");
      const mintHash = await writeContractAsync({
        address: GATEWAY_MINTER_ADDRESS,
        abi: GATEWAY_MINTER_ABI,
        functionName: "gatewayMint",
        args: [attestationResult.attestation, attestationResult.signature],
        chainId: destination.chain.id,
      });
      setTxHash(mintHash);

      // Wait for confirmation with generous timeout
      const destinationClient = getPublicClient(wagmiConfig, {
        chainId: destination.chain.id,
      });
      if (destinationClient) {
        try {
          await destinationClient.waitForTransactionReceipt({
            hash: mintHash,
            timeout: 180_000,
            pollingInterval: 4_000,
          });
        } catch (waitErr) {
          setStatus("error");
          setErrorMessage(
            `Bridge transaction submitted (${mintHash}) but confirmation is taking longer than expected. ` +
              `Check the destination chain explorer with this hash — it may have already succeeded.`,
          );
          return;
        }
      }

      setStatus("complete");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        (err as Error).message ?? "The bridge could not be completed",
      );
    }
  }

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
    setTxHash(null);
  }

  return { status, errorMessage, txHash, bridge, reset };
}

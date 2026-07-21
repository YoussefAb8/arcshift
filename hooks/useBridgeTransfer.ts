"use client";

import { useState } from "react";
import { useWriteContract, useSwitchChain } from "wagmi";
import { getPublicClient } from "wagmi/actions";
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
import { wagmiConfig } from "@/lib/wagmi";

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

      // STEP 1: Approve
      setStatus("approving");
      const approveHash = await writeContractAsync({
        address: source.usdcAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [GATEWAY_WALLET_ADDRESS, params.amount],
        chainId: source.chain.id,
      });

      const sourceClient = getPublicClient(wagmiConfig, {
        chainId: source.chain.id,
      });
      if (sourceClient) {
        await sourceClient.waitForTransactionReceipt({
          hash: approveHash,
          timeout: 180_000,
          pollingInterval: 4_000,
        });
      }

      // STEP 2: Deposit
      setStatus("depositing");
      const depositHash = await writeContractAsync({
        address: GATEWAY_WALLET_ADDRESS,
        abi: GATEWAY_WALLET_ABI,
        functionName: "deposit",
        args: [source.usdcAddress, params.amount],
        chainId: source.chain.id,
      });

      if (sourceClient) {
        await sourceClient.waitForTransactionReceipt({
          hash: depositHash,
          timeout: 180_000,
          pollingInterval: 4_000,
        });
      }

      // STEP 3: Sign burn intent
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

      // STEP 4: Get attestation
      setStatus("attesting");
      const attestationResult = await submitBurnIntent(
        typedData.message,
        signature,
      );

      // STEP 5: Switch to destination chain BEFORE minting
      setStatus("switching-network");
      await switchChainAsync({ chainId: destination.chain.id });

      // STEP 6: Mint on destination chain
      setStatus("minting");
      const mintHash = await writeContractAsync({
        address: GATEWAY_MINTER_ADDRESS,
        abi: GATEWAY_MINTER_ABI,
        functionName: "gatewayMint",
        args: [attestationResult.attestation, attestationResult.signature],
        chainId: destination.chain.id,
      });
      setTxHash(mintHash);

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
            `Transaction submitted (${mintHash}) but confirmation is taking longer than expected. Check the destination chain explorer — it may have already succeeded.`,
          );
          return;
        }
      }

      // STEP 7: Switch back to Arc Testnet after minting
      await switchChainAsync({ chainId: source.chain.id });

      setStatus("complete");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        (err as Error).message ?? "The transfer could not be completed",
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

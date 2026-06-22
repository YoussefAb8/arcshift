/**
 * hooks/useGatewayTransfer.ts
 *
 * Orchestrates steps 2-5 of the Gateway flow: sign a burn intent (no gas
 * cost), submit it to Circle's Gateway API for an attestation, then mint
 * on the destination chain (one on-chain transaction, paid in that
 * chain's gas token).
 *
 * NOTE: Minting on a destination chain OTHER than Arc requires the
 * wallet to switch networks first, since the mint transaction must be
 * signed and broadcast on that destination chain. This app's UI calls
 * `switchChainAsync` before the mint step when needed.
 */
"use client";

import { useState } from "react";
import { useWriteContract, useSwitchChain } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { buildBurnIntentTypedData, submitBurnIntent } from "@/lib/gateway";
import { GATEWAY_MINTER_ABI, GATEWAY_MINTER_ADDRESS, SUPPORTED_CHAINS, PRIMARY_CHAIN_KEY } from "@/config/chains";
import { wagmiConfig } from "@/lib/wagmi";

export type TransferStatus =
  | "idle"
  | "signing"
  | "attesting"
  | "switching-network"
  | "minting"
  | "complete"
  | "error";

export interface TransferParams {
  destinationChainKey: string;
  recipientAddress: `0x${string}`;
  amount: bigint;
  depositorAddress: `0x${string}`;
  signTypedDataAsync: (args: unknown) => Promise<`0x${string}`>;
}

export function useGatewayTransfer() {
  const [status, setStatus] = useState<TransferStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mintTxHash, setMintTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  async function transfer(params: TransferParams) {
    setErrorMessage(null);
    setMintTxHash(null);

    try {
      const source = SUPPORTED_CHAINS[PRIMARY_CHAIN_KEY]!;
      const destination = SUPPORTED_CHAINS[params.destinationChainKey];
      if (!destination) {
        throw new Error("Unknown destination chain selected");
      }

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

      setStatus("attesting");
      const attestationResult = await submitBurnIntent(
        typedData.message,
        signature,
      );

      // If the destination is a different chain than the one the wallet is
      // currently connected to, prompt a network switch before minting.
      if (destination.chain.id !== source.chain.id) {
        setStatus("switching-network");
        await switchChainAsync({ chainId: destination.chain.id });
      }

      setStatus("minting");
      const mintHash = await writeContractAsync({
        address: GATEWAY_MINTER_ADDRESS,
        abi: GATEWAY_MINTER_ABI,
        functionName: "gatewayMint",
        args: [attestationResult.attestation, attestationResult.signature],
        chainId: destination.chain.id,
      });
      setMintTxHash(mintHash);

      // IMPORTANT: this client must be scoped to the DESTINATION chain,
      // not whichever chain the hook originally connected to -- otherwise
      // we'd be asking the wrong network whether our transaction confirmed.
      // We also raise the timeout well above viem's 90-second default:
      // public testnets like Sepolia can be slower and inconsistent, and a
      // transaction that's actually succeeding shouldn't be reported as
      // "timed out" just because our own patience ran out first.
      const destinationClient = getPublicClient(wagmiConfig, {
        chainId: destination.chain.id,
      });
      if (destinationClient) {
        try {
          await destinationClient.waitForTransactionReceipt({
            hash: mintHash,
            timeout: 180_000, // 3 minutes
            pollingInterval: 4_000,
          });
        } catch (waitErr) {
          // The transaction may still succeed even if OUR wait gave up.
          // Don't treat this as a hard failure -- surface a clear status
          // and let the person verify on the explorer instead of lying
          // to them by saying "failed" when it might still confirm.
          setStatus("error");
          setErrorMessage(
            `The mint transaction was submitted (hash: ${mintHash}) but confirmation is taking longer than expected. ` +
              `Check the destination chain's block explorer with this hash before retrying -- it may have already succeeded.`,
          );
          return;
        }
      }
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
    setMintTxHash(null);
  }

  return { status, errorMessage, mintTxHash, transfer, reset };
}

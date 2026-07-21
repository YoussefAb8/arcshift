"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { useBridgeTransfer } from "@/hooks/useBridgeTransfer";
import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { useUsdcBalance } from "@/hooks/useUsdcBalance";
import { isValidEvmAddress, validateAmount } from "@/lib/usdc";
import { getDestinationChains } from "@/config/chains";
import { TransferPipeline } from "./TransferPipeline";
import { useToast } from "./Toast";

const STATUS_LABEL: Record<string, string> = {
  approving: "Approving spending...",
  depositing: "Preparing bridge...",
  signing: "Sign in your wallet...",
  attesting: "Waiting for Circle Gateway...",
  "switching-network": "Switch your wallet to destination network...",
  minting: "Finalizing on destination chain...",
  complete: "Transfer complete! USDC received on destination chain.",
  error: "Transfer failed.",
};

export function TransferPanel() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const balance = useUsdcBalance(address);
  const unified = useUnifiedBalance(address);
  const { status, errorMessage, txHash, bridge, reset } = useBridgeTransfer();
  const toast = useToast();

  const destinations = getDestinationChains();
  const [destinationKey, setDestinationKey] = useState(
    destinations[0]?.[0] ?? "",
  );
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

  const isBusy =
    status !== "idle" && status !== "error" && status !== "complete";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: { recipient?: string; amount?: string } = {};

    if (!isValidEvmAddress(recipient)) {
      errors.recipient =
        "Enter a valid EVM address (0x followed by 40 hex characters)";
    }

    const amountResult = validateAmount(amount, balance.erc20Raw);
    if (!amountResult.ok) {
      errors.amount = amountResult.error;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (!address) return;

    await bridge({
      destinationChainKey: destinationKey,
      recipientAddress: recipient as `0x${string}`,
      amount: amountResult.ok ? amountResult.amount : 0n,
      depositorAddress: address,
      signTypedDataAsync: (typedData) =>
        signTypedDataAsync(
          typedData as Parameters<typeof

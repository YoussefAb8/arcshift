"use client";

import { SUPPORTED_CHAINS } from "@/config/chains";
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
          typedData as Parameters<typeof signTypedDataAsync>[0],
        ),
    });
  }

  useEffect(() => {
    if (status === "complete") {
      balance.refetch();
      void unified.refetch();
      toast.show(
        "Transfer complete! USDC is on its way to the destination chain.",
        "success",
      );
      setRecipient("");
      setAmount("");
      reset();
    } else if (status === "error" && errorMessage) {
      toast.show(errorMessage, "error");
    }
  }, [status]);

  return (
    <div className="rounded-2xl border border-line bg-panel p-8">
      <h2 className="text-lg font-semibold mb-1">Send USDC</h2>
      <p className="text-sm text-muted mb-6">
        Send USDC from Arc Testnet to any supported chain instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="destination"
            className="text-xs uppercase tracking-wider text-muted block mb-2"
          >
            Destination chain
          </label>
          <select
            id="destination"
            value={destinationKey}
            disabled={!isConnected || isBusy}
            onChange={(e) => setDestinationKey(e.target.value)}
            className="w-full rounded-lg border border-line bg-ink px-4 py-3 focus:outline-none focus:ring-2 focus:ring-action disabled:opacity-50"
          >
            {destinations.map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="recipient"
            className="text-xs uppercase tracking-wider text-muted block mb-2"
          >
            Recipient address
          </label>
          <input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipient}
            disabled={!isConnected || isBusy}
            onChange={(e) => {
              setRecipient(e.target.value);
              setFieldErrors((prev) => ({ ...prev, recipient: undefined }));
            }}
            className="w-full rounded-lg border border-line bg-ink px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-action disabled:opacity-50"
          />
          {fieldErrors.recipient && (
            <p className="text-danger text-sm mt-2">{fieldErrors.recipient}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="send-amount"
            className="text-xs uppercase tracking-wider text-muted block mb-2"
          >
            Amount (USDC)
          </label>
          <input
            id="send-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            disabled={!isConnected || isBusy}
            onChange={(e) => {
              setAmount(e.target.value);
              setFieldErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            className="w-full rounded-lg border border-line bg-ink px-4 py-3 font-mono text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-action disabled:opacity-50"
          />
          {fieldErrors.amount && (
            <p className="text-danger text-sm mt-2">{fieldErrors.amount}</p>
          )}
          <p className="text-xs text-muted mt-2">
            Available: {balance.isLoading ? "..." : balance.erc20Formatted} USDC
          </p>
        </div>

        <button
          type="submit"
          disabled={!isConnected || isBusy}
          className="w-full rounded-lg bg-action px-5 py-3 font-semibold text-white transition-colors hover:bg-action-dim disabled:opacity-40"
        >
          {isBusy ? "Sending..." : "Send"}
        </button>

        {status !== "idle" && (
          <div className="rounded-lg border border-line bg-ink p-5">
            {status === "complete" && (
              <div>
                <p className="text-success text-sm font-medium">
                  Transfer submitted successfully
                </p>
                <p className="text-muted text-xs mt-1">
                  USDC is on its way. This usually takes 2-5 minutes on testnet.
                </p>
                {txHash && (
                  
                    href={`${SUPPORTED_CHAINS[destinationKey]?.explorerUrl}/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-action text-xs block mt-2 hover:underline"
                  >
                    View transaction on explorer →
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => { reset(); setRecipient(""); setAmount(""); }}
                  className="text-xs text-muted hover:text-paper mt-3 underline block"
                >
                  Send again
                </button>
              </div>
            )}

            {status === "error" && (
              <div>
                <p className="text-danger text-sm">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="text-xs text-muted hover:text-paper mt-3 underline block"
                >
                  Try again
                </button>
              </div>
            )}

            {status !== "complete" && status !== "error" && (
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-pending pulse-dot" />
                <p className="text-pending text-sm">
                  {STATUS_LABEL[status]}
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

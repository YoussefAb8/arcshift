"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGatewayDeposit } from "@/hooks/useGatewayDeposit";
import { useUsdcBalance } from "@/hooks/useUsdcBalance";
import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { validateAmount } from "@/lib/usdc";
import { getPrimaryChain } from "@/config/chains";
import { useToast } from "./Toast";

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  approving: "Step 1 of 2 — approving Gateway to spend your USDC…",
  approved: "Approval confirmed.",
  depositing: "Step 2 of 2 — depositing into your Unified Balance…",
  complete: "Deposit complete.",
  error: "Deposit failed.",
};

export function DepositPanel() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const balance = useUsdcBalance(address);
  const unified = useUnifiedBalance(address);
  const { status, errorMessage, txHashes, deposit, reset } = useGatewayDeposit();
  const toast = useToast();
  const primary = getPrimaryChain();

  const isBusy = status === "approving" || status === "depositing" || status === "approved";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);

    const result = validateAmount(amount, balance.erc20Raw);
    if (!result.ok) {
      setFieldError(result.error);
      return;
    }

    await deposit(result.amount);
  }

  // Refresh balances and notify the user once the deposit completes or fails.
  // This runs in an effect (after render finishes) rather than during render,
  // which is required because it changes state in OTHER components (the toast).
  useEffect(() => {
    if (status === "complete") {
      balance.refetch();
      void unified.refetch();
      toast.show("USDC deposited into your Unified Balance", "success");
      setAmount("");
      reset();
    } else if (status === "error" && errorMessage) {
      toast.show(errorMessage, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="rounded-2xl border border-line bg-panel p-8">
      <h2 className="text-lg font-semibold mb-1">Deposit into Unified Balance</h2>
      <p className="text-sm text-muted mb-6">
        Move USDC from your {primary.label} wallet into Gateway so it becomes
        spendable on any supported chain.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deposit-amount" className="text-xs uppercase tracking-wider text-muted block mb-2">
            Amount (USDC)
          </label>
          <input
            id="deposit-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            disabled={!isConnected || isBusy}
            onChange={(e) => {
              setAmount(e.target.value);
              setFieldError(null);
            }}
            className="w-full rounded-lg border border-line bg-ink px-4 py-3 font-mono text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-action disabled:opacity-50"
          />
          {fieldError && <p className="text-danger text-sm mt-2">{fieldError}</p>}
        </div>

        <button
          type="submit"
          disabled={!isConnected || isBusy}
          className="w-full rounded-lg bg-action px-5 py-3 font-semibold text-white transition-colors hover:bg-action-dim disabled:opacity-40"
        >
          {isBusy ? "Processing…" : "Deposit"}
        </button>

        {status !== "idle" && (
          <div className="rounded-lg border border-line bg-ink p-4 text-sm">
            <p
              className={
                status === "error"
                  ? "text-danger"
                  : status === "complete"
                    ? "text-success"
                    : "text-pending"
              }
            >
              {status !== "complete" && status !== "error" && (
                <span className="inline-block h-2 w-2 rounded-full bg-pending pulse-dot mr-2 align-middle" />
              )}
              {STATUS_LABEL[status]}
            </p>
            {txHashes.approve && (
              <a
                href={`${primary.explorerUrl}/tx/${txHashes.approve}`}
                target="_blank"
                rel="noreferrer"
                className="text-action text-xs block mt-1 hover:underline"
              >
                View approval transaction →
              </a>
            )}
            {txHashes.deposit && (
              <a
                href={`${primary.explorerUrl}/tx/${txHashes.deposit}`}
                target="_blank"
                rel="noreferrer"
                className="text-action text-xs block mt-1 hover:underline"
              >
                View deposit transaction →
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

"use client";

import type { BridgeStatus } from "@/hooks/useBridgeTransfer";

const STEPS: { key: BridgeStatus; label: string }[] = [
  { key: "approving", label: "Approve" },
  { key: "depositing", label: "Deposit" },
  { key: "signing", label: "Sign" },
  { key: "attesting", label: "Attest" },
  { key: "switching-network", label: "Switch" },
  { key: "minting", label: "Mint" },
  { key: "complete", label: "Done" },
];

const ORDER: BridgeStatus[] = [
  "approving",
  "depositing",
  "signing",
  "attesting",
  "switching-network",
  "minting",
  "complete",
];

export function TransferPipeline({ status }: { status: BridgeStatus }) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <div className="flex items-start" aria-label="Transfer progress">
      {STEPS.map((step, i) => {
        const stepIndex = ORDER.indexOf(step.key);
        const isDone = currentIndex > stepIndex;
        const isActive = status === step.key;
        const isComplete = status === "complete";

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  isComplete
                    ? "bg-success"
                    : isActive
                      ? "bg-brand pulse-dot"
                      : isDone
                        ? "bg-success"
                        : "bg-line-strong"
                }`}
              />
              <span
                className={`text-[9px] uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-brand-light"
                    : isDone || isComplete
                      ? "text-success"
                      : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 mb-4 transition-colors duration-500 ${
                  currentIndex > stepIndex || isComplete
                    ? "bg-success"
                    : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

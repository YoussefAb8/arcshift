"use client";

import type { TransferStatus } from "@/hooks/useGatewayTransfer";

const STEPS: { key: TransferStatus; label: string }[] = [
  { key: "signing", label: "Sign" },
  { key: "attesting", label: "Attest" },
  { key: "switching-network", label: "Switch" },
  { key: "minting", label: "Mint" },
  { key: "complete", label: "Done" },
];

const ORDER: TransferStatus[] = [
  "signing",
  "attesting",
  "switching-network",
  "minting",
  "complete",
];

export function TransferPipeline({ status }: { status: TransferStatus }) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <div className="flex items-center" aria-label="Transfer progress">
      {STEPS.map((step, i) => {
        const stepIndex = ORDER.indexOf(step.key);
        const isDone = currentIndex > stepIndex || status === "complete" && step.key !== "complete";
        const isActive = status === step.key;
        const isComplete = status === "complete";

        const dotColor = isComplete
          ? "bg-success"
          : isActive
            ? "bg-pending"
            : isDone
              ? "bg-success"
              : "bg-line";

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${dotColor} ${isActive ? "pulse-dot" : ""}`}
              />
              <span
                className={`text-[10px] uppercase tracking-wider ${
                  isActive ? "text-pending" : isDone || isComplete ? "text-success" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 mb-4 ${
                  currentIndex > stepIndex || isComplete ? "bg-success" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

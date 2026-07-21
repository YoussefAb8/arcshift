"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { BalanceLedger } from "@/components/BalanceLedger";
import { TransferPanel } from "@/components/TransferPanel";
import { useEnsureArcTestnet } from "@/hooks/useEnsureArcTestnet";
import { getPrimaryChain } from "@/config/chains";

export default function Home() {
  useEnsureArcTestnet();
  const primary = getPrimaryChain();
  const faucetUrl = primary.faucetUrl;
  const label = primary.label;

  return React.createElement("main", { className: "max-w-3xl mx-auto px-6 py-12" },
    React.createElement("header", { className: "flex items-center justify-between mb-2" },
      React.createElement("div", { className: "flex items-center gap-2" },
        React.createElement("span", { className: "h-2 w-2 rounded-full bg-action" }),
        React.createElement("span", { className: "text-sm font-medium uppercase tracking-wider text-muted" }, label + " · Testnet")
      ),
      React.createElement(ConnectButton, null)
    ),
    React.createElement("h1", { className: "font-mono text-3xl font-semibold mt-8 mb-2" }, "ArcShift"),
    React.createElement("p", { className: "text-muted mb-10 max-w-lg" }, "Send USDC across chains with one click. Connect your wallet, enter an amount and destination, and your funds arrive instantly."),
    React.createElement("div", { className: "space-y-6" },
      React.createElement(BalanceLedger, null),
      React.createElement(TransferPanel, null)
    ),
    React.createElement("footer", { className: "mt-12 pt-6 border-t border-line text-xs text-muted" },
      "Testnet only. No real funds are used. Get testnet USDC: ",
      React.createElement("a", { href: faucetUrl, target: "_blank", rel: "noreferrer", className: "text-action hover:underline" }, "faucet.circle.com")
    )
  );
}

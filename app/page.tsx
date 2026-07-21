"use client";
import React from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { BalanceLedger } from "@/components/BalanceLedger";
import { TransferPanel } from "@/components/TransferPanel";
import { useEnsureArcTestnet } from "@/hooks/useEnsureArcTestnet";
import { getPrimaryChain } from "@/config/chains";
export default function Home() {
  useEnsureArcTestnet();
  const primary = getPrimaryChain();
  return (
    <main>
      <header>
        <ConnectButton />
      </header>
      <h1>ArcShift</h1>
      <p>Send USDC across chains with one click.</p>
      <BalanceLedger />
      <TransferPanel />
      <footer>
        <a href={primary.faucetUrl} target="_blank" rel="noreferrer">
          Get testnet USDC
        </a>
      </footer>
    </main>
  );
}

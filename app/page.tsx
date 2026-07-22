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
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* Navbar */}
      <nav className="flex items-center justify-between mb-20">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ArcShift"
            className="h-10 w-auto"
          />

          <span className="rounded-full border border-line-strong bg-ink px-3 py-1 text-xs text-brand-light">
            TESTNET
          </span>
        </div>

        <ConnectButton />
      </nav>

      {/* Hero */}
      <section className="text-center mb-16">

        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">

          <span className="text-white">
            Bridge USDC,
          </span>{" "}

          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            instantly.
          </span>

        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-8 text-muted">
          Transfer USDC from Arc Testnet to supported chains in one click. Fast, secure, and powered by Circle Gateway.
        </p>

      </section>

      {/* Main Content */}
      <div className="space-y-6">

        <BalanceLedger />

        <TransferPanel />

      </div>

      {/* Footer */}
      <footer className="mt-14 flex items-center justify-between border-t border-line pt-6">

        <span className="text-xs text-muted">
          Testnet only. No real funds.
        </span>

        <a
          href={primary.faucetUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-brand transition-colors hover:text-brand-light"
        >
          Get testnet USDC
        </a>

      </footer>
    </main>
  );
}

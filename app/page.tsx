"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { BalanceLedger } from "@/components/BalanceLedger";
import { TransferPanel } from "@/components/TransferPanel";
import { useEnsureArcTestnet } from "@/hooks/useEnsureArcTestnet";

export default function Home() {
  useEnsureArcTestnet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      <div className="mx-auto max-w-6xl px-6 py-8">

        <header className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              ArcShift
            </h1>

            <p className="mt-2 text-slate-400">
              Instant Cross-Chain USDC Transfers
            </p>

          </div>

          <ConnectButton />

        </header>

        <section className="mt-16 text-center">

          <h2 className="text-6xl font-bold">
            Move USDC
            <br />
            Across Chains
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Secure, fast and seamless cross-chain transfers powered by Arc.
          </p>

        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">

          <BalanceLedger />

          <TransferPanel />

        </section>

      </div>

    </main>
  );
}

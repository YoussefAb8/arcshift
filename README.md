# ArcShift 🔵

**Arc-native USDC transfers with Unified Balance across supported chains.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arcshift--pi.vercel.app-blue)](https://arcshift-pi.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## Overview

ArcShift is a testnet dapp that lets you deposit USDC into a **Unified Balance** on Arc Testnet, then send it to any supported destination chain with a single transaction flow. No bridge complexity. No fragmented balances. Just one pool of USDC, spendable everywhere.

Built with [Arc Testnet](https://arc.network) as the primary settlement layer and [Circle's Gateway protocol](https://www.circle.com/en/cross-chain-transfer) for cross-chain transfers.

## Features

- **Unified Balance**: Deposit USDC once, send to multiple chains
- **Arc-Native**: Uses Arc Testnet as the primary settlement layer
- **Gateway Protocol**: Leverages Circle's burn-intent + attestation model for secure cross-chain transfers
- **Real-Time Status**: Visual pipeline showing deposit → attest → mint progress
- **Wallet Integration**: Connect MetaMask or any EVM-compatible wallet
- **EIP-712 Signatures**: Sign burn intents without paying gas (off-chain signatures)
- **Multi-Chain Support**: Ethereum Sepolia with room to add more destinations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Wagmi v2, Viem v2.21, Circle Gateway API
- **State Management**: React Query, Wagmi hooks
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js v24+ (download from [nodejs.org](https://nodejs.org))
- MetaMask or compatible EVM wallet
- Arc Testnet configured in your wallet

### Installation

1. **Clone the repo**:
```bash
   git clone https://github.com/YoussefAb8/arcshift.git
   cd arcshift
```

2. **Install dependencies**:
```bash
   npm install
```

3. **Set up environment variables**:
```bash
   cp .env.example .env.local
```
   (Optional — defaults are already configured for testnet)

4. **Start the dev server**:
```bash
   npm run dev
```

5. **Open in browser**:

# ArcShift 🔵

**Arc-native USDC transfers with Unified Balance across supported chains.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arcshift--pi.vercel.app-blue)](https://arcshift-pi.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-YoussefAb8/arcshift-black)](https://github.com/YoussefAb8/arcshift)
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
http://localhost:3000

### Setup Arc Testnet in MetaMask

If you haven't already, add Arc Testnet to MetaMask:

- **Network Name**: Arc Testnet
- **RPC URL**: `https://rpc.testnet.arc.network`
- **Chain ID**: `5042002`
- **Currency Symbol**: `USDC`
- **Block Explorer**: `https://testnet.arcscan.app`

### Get Testnet Funds

Visit the Circle Faucet to get free testnet USDC:
https://faucet.circle.com

## How to Use

1. **Connect Your Wallet**
   - Click "Connect wallet" and approve MetaMask popup

2. **Check Your Balance**
   - See your USDC balance on Arc Testnet
   - View your Unified Balance across supported chains

3. **Deposit into Unified Balance**
   - Enter amount in the "Deposit into Unified Balance" panel
   - Click "Deposit" and approve two transactions:
     1. Approve spending (MetaMask popup)
     2. Deposit into Gateway (MetaMask popup)
   - Wait for confirmation (~30 seconds on Arc)

4. **Send Across Chains**
   - Select destination chain (e.g., Ethereum Sepolia)
   - Enter recipient address
   - Enter amount from your Unified Balance
   - Click "Send"
   - Sign the burn intent (free, no gas)
   - Switch network when prompted
   - Approve final mint transaction on destination
   - Watch the pipeline visual as it progresses

5. **Check Results**
   - Once complete, recipient receives USDC on destination chain
   - Full pipeline takes 2-5 minutes on testnet (can be slower if network is busy)

## Architecture

### How It Works

**ArcShift's flow follows Circle's Gateway protocol exactly**:

1. **Deposit** (on Arc Testnet)
   - User approves USDC spending
   - Gateway Wallet contract receives USDC
   - Funds locked in Unified Balance pool

2. **Sign Burn Intent** (off-chain)
   - User signs EIP-712 typed message
   - No gas cost, no blockchain interaction
   - Burn intent specifies: source chain, destination chain, amount, recipient

3. **Get Attestation** (from Circle's Gateway API)
   - Signed burn intent sent to `gateway-api-testnet.circle.com/v1/transfer`
   - Circle validates and returns attestation + signature

4. **Mint on Destination** (on destination chain)
   - User's wallet switches to destination chain
   - `gatewayMint()` called with attestation
   - Destination chain mints equivalent USDC to recipient
   - Transaction paid in destination chain's native gas token

### Key Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| Arc Native USDC | `0x3600000000000000000000000000000000000000` | Native USDC on Arc (18 decimals for gas, 6 decimals via ERC-20 interface) |
| Gateway Wallet | `0x0077777d7EBA4688BDeF3E311b846F25870A19B9` | Receives deposits, holds Unified Balance |
| Gateway Minter | `0x0022222ABE238Cc2C7Bb1f21003F0a260052475B` | Mints USDC on destination chains |

### Supported Chains

| Chain | Chain ID | Domain ID | RPC |
|-------|----------|-----------|-----|
| Arc Testnet | 5042002 | 26 | https://rpc.testnet.arc.network |
| Ethereum Sepolia | 11155111 | 0 | https://sepolia.infura.io/v3/ |

More chains coming soon.

## Project Structure

arcshift/

├── app/                    # Next.js App Router

│   ├── layout.tsx         # Root layout

│   ├── page.tsx           # Home page

│   ├── globals.css        # Global styles

│   ├── providers.tsx      # Wagmi + React Query providers

│   └── api/               # Server-side API routes

│       └── gateway/       # Circle Gateway API proxies

├── components/            # React components

│   ├── ConnectButton.tsx

│   ├── BalanceLedger.tsx

│   ├── DepositPanel.tsx

│   ├── TransferPanel.tsx

│   ├── TransferPipeline.tsx

│   ├── NetworkGuard.tsx

│   └── Toast.tsx

├── hooks/                 # Custom React hooks

│   ├── useUsdcBalance.ts

│   ├── useUnifiedBalance.ts

│   ├── useGatewayDeposit.ts

│   └── useGatewayTransfer.ts

├── lib/                   # Utilities & services

│   ├── wagmi.ts          # Wagmi config (all supported chains)

│   ├── usdc.ts           # USDC amount parsing + validation

│   └── gateway.ts        # EIP-712 burn intent signing

├── config/                # Configuration

│   └── chains.ts         # Chain definitions, contract addresses

├── public/                # Static assets

├── package.json

├── tsconfig.json

├── next.config.js

├── tailwind.config.js

└── README.md

## Design Philosophy

- **Arc-first**: Arc Testnet is treated as the home chain; all balances originate here
- **Gateway-native**: Full reliance on Circle's Gateway protocol; no custom bridge code
- **User clarity**: Visual pipeline shows exactly which step of the multi-step flow is happening
- **Testnet realistic**: Timeouts and error messages acknowledge slow/unreliable testnet conditions
- **TypeScript strict**: Full type safety, no `any` types
- **Clean architecture**: Separation between UI (components), state (hooks), and business logic (lib/)

## Known Limitations & Future Work

### Current Limitations

- **Testnet only**: Not production-ready; uses testnet faucet funds
- **Single source chain**: Arc Testnet only (deposits must come from Arc)
- **Limited destinations**: Currently only Ethereum Sepolia (adding more soon)
- **Slow confirmations**: Testnet can be slow; wait times are realistic (~2-5 minutes end-to-end)

### Planned Features

- [ ] Support for Base Sepolia, Arbitrum Sepolia as destination chains
- [ ] Swap functionality before minting (swaps testnet USDC to destination chain's preferred token)
- [ ] Better loading states and network retry logic
- [ ] Transaction history / receipt management
- [ ] Mainnet deployment (once Arc + Gateway launch mainnet)
- [ ] Custom RPC endpoint support for users behind restrictive networks

## Development

### Build for production

```bash
npm run build
npm run start
```

### Run type checking

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

## Testing on Testnet

### Step-by-step test flow

1. Ensure Arc Testnet and Ethereum Sepolia are both added to MetaMask
2. Get testnet USDC from Circle Faucet
3. Deposit 1 USDC into Unified Balance (approve + deposit, ~1 min)
4. Send 0.5 USDC to a test address on Sepolia
5. Watch the pipeline: Sign → Attest → Switch → Mint
6. Verify receipt on Sepolia Etherscan after ~2-3 minutes
7. Check your Unified Balance decreased by 0.5 USDC

## Contributing

I welcome contributions! This is a learning project, so issues, PRs, and feedback are valuable.

**To contribute**:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Areas where help is welcome**:

- Adding more destination chains (Arbitrum, Base, Optimism)
- Improving error messages
- Performance optimization
- Testnet UX improvements
- Documentation

## Lessons Learned

Building ArcShift taught me:

- **Arc's elegance**: Native USDC as both gas and ERC-20 in one contract is genuinely powerful
- **Gateway's power**: The burn-intent + attestation model is secure and flexible
- **Testnet patience**: Even "simple" flows take 2-5 minutes on public testnets — UX must reflect reality
- **EIP-712 value**: Signed structured messages are a game-changer for user trust (they can read exactly what they're signing)

## Deployment

This project is deployed on **Vercel**:
https://arcshift-pi.vercel.app/

**To deploy your own**:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and select this repo
4. Leave all settings default
5. Click "Deploy"

Vercel automatically redeploys on every push to `main`.

## License

MIT License — see [LICENSE](./LICENSE) for details.

## Contact & Links

- **Live Demo**: https://arcshift-pi.vercel.app/
- **GitHub**: https://github.com/YoussefAb8/arcshift
- **Arc Testnet**: https://arc.network
- **Circle Gateway**: https://www.circle.com/en/cross-chain-transfer
- **Discord**: [Arc Community](https://discord.gg/buildonarc)

---

**Built with ❤️ on Arc Testnet by Storka**

Questions or feedback? Open an issue or reach out on Discord.

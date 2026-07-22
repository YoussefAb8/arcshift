# ArcShift 🔵

> **Send native USDC from Arc Testnet to supported EVM chains in one seamless flow.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://arcshift-pi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Overview

ArcShift is a decentralized application built on **Arc Testnet** that enables users to transfer native USDC across supported EVM chains through **Circle Gateway**.

Instead of interacting directly with bridge contracts, ArcShift provides a simple interface where users can:

- Connect their wallet
- Select a destination chain
- Enter the recipient address
- Send USDC across chains
- Track the transfer status until completion

The goal is to make cross-chain transfers simple while showcasing Arc's native USDC infrastructure.

---

## Features

- Connect any EVM-compatible wallet
- View your Arc Testnet USDC balance
- Transfer native USDC across supported chains
- Automatic EIP-712 signing
- Live transfer status updates
- Explorer link after completion
- Responsive interface
- Built with modern React and Next.js

---

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### Web3

- Wagmi v2
- Viem
- Circle Gateway
- Arc Testnet

### Deployment

- Vercel

---

# Supported Chains

| Network | Role |
|----------|------|
| Arc Testnet | Source Chain |
| Ethereum Sepolia | Destination |

More networks will be added soon.

---

# Getting Started

## Prerequisites

- Node.js 20+
- npm
- MetaMask or another EVM wallet

---

## Installation

Clone the repository

```bash
git clone https://github.com/YoussefAb8/arcshift.git
cd arcshift
```

Install dependencies

```bash
npm install
```

Create your environment file

```bash
cp .env.example .env.local
```

Run the application

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Using ArcShift

### 1. Connect Wallet

Connect your MetaMask wallet.

---

### 2. Get Testnet USDC

Request free USDC from the Circle Faucet.

---

### 3. Select Destination Chain

Choose the blockchain where you'd like to receive USDC.

---

### 4. Enter Recipient

Provide a valid EVM wallet address.

---

### 5. Enter Amount

Choose the amount of USDC to transfer.

---

### 6. Sign the Request

Approve the required wallet prompts.

---

### 7. Receive USDC

After Circle completes the transfer, USDC appears on the destination chain.

---

# Project Structure

```
arcshift/

├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── providers.tsx
│
├── components/
│   ├── BalanceLedger.tsx
│   ├── ConnectButton.tsx
│   ├── Toast.tsx
│   └── TransferPanel.tsx
│
├── hooks/
│
├── config/
│
├── lib/
│
├── public/
│
├── package.json
└── README.md
```

---

# Architecture

```
User

↓

ArcShift Frontend

↓

Circle Gateway

↓

Destination Chain

↓

Recipient receives USDC
```

---

# Why ArcShift?

ArcShift focuses on providing a clean and simple user experience for cross-chain USDC transfers.

Instead of exposing users to bridge complexity, the application guides them through a straightforward transfer flow while handling the underlying interactions with Circle Gateway.

---

# Roadmap

- Add Base Sepolia
- Add Arbitrum Sepolia
- Add Optimism Sepolia
- Transaction History
- Improved UI/UX
- Mobile Optimization
- Mainnet Support

---

# Deployment

The application is deployed on Vercel.

Live Demo

https://arcshift-pi.vercel.app/

---

# Contributing

Contributions are welcome.

If you'd like to improve ArcShift:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push your branch.

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Links

**Live Demo**

https://arcshift-pi.vercel.app/

**GitHub**

https://github.com/YoussefAb8/arcshift

**Arc**

https://arc.network

**Circle Gateway**

https://developers.circle.com/

/**
 * config/chains.ts
 *
 * This file is the single source of truth for every blockchain network,
 * contract address, and domain ID this app knows about.
 *
 * ARCHITECTURE NOTE FOR MIGRATION TO MAINNET:
 * Every value below is a TESTNET value. When Arc and Gateway launch on
 * mainnet, duplicate this file's shape (do not edit in place) into
 * `config/chains.mainnet.ts` and switch which one is imported based on
 * the NEXT_PUBLIC_NETWORK_MODE environment variable. Keeping testnet and
 * mainnet configs in separate files (instead of one file with if/else
 * branches everywhere) makes it much harder to accidentally mix real
 * funds with test funds.
 */

import { defineChain } from "viem";
import { sepolia } from "viem/chains";
import type { Chain } from "viem";

/**
 * Arc Testnet is manually defined here (rather than imported from
 * viem/chains) because not every viem version ships this chain yet.
 * Defining it ourselves also means we are never blocked by a viem
 * upgrade or downgrade -- these values are independently verified
 * against Arc's official documentation at docs.arc.network/arc/references/connect-to-arc.
 */
export const arcTestnet: Chain = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "Arcscan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
});

/** Is this app currently in testnet or mainnet mode. Always "testnet" today. */
export const NETWORK_MODE: "testnet" | "mainnet" =
  (process.env.NEXT_PUBLIC_NETWORK_MODE as "testnet" | "mainnet") ?? "testnet";

/**
 * Gateway protocol contracts. These are the same address on every chain
 * Gateway supports (Circle deploys them deterministically), which is why
 * they live here once rather than per-chain.
 * Source: official Arc docs, "Access USDC Crosschain" tutorial.
 */
export const GATEWAY_WALLET_ADDRESS =
  "0x0077777d7EBA4688BDeF3E311b846F25870A19B9" as const;
export const GATEWAY_MINTER_ADDRESS =
  "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B" as const;

/** Circle's public testnet Gateway API. No API key required for these endpoints. */
export const GATEWAY_API_BASE = "https://gateway-api-testnet.circle.com";

/**
 * Arc Testnet's native USDC system-contract address. On Arc, USDC is both
 * the native gas token AND accessible through this address via a standard
 * ERC-20 interface (balanceOf, transfer, approve). It is not a separate
 * token from the gas balance -- it is the same money, two interfaces.
 */
export const ARC_NATIVE_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;

export interface ChainConfig {
  /** Human readable name shown in the UI */
  label: string;
  /** The viem chain definition (has chainId, RPC defaults, etc.) */
  chain: Chain;
  /** Gateway's internal numeric ID for this chain -- NOT the chain ID */
  domainId: number;
  /** The USDC ERC-20 contract address on this chain */
  usdcAddress: `0x${string}`;
  /** Block explorer base URL for building tx links */
  explorerUrl: string;
  /** Faucet URL where a user can get free testnet funds */
  faucetUrl: string;
  /** Is this the chain the app treats as "home" */
  isPrimary?: boolean;
}

/**
 * Every chain this app can interact with. Arc Testnet is the primary chain
 * (isPrimary: true) -- the app always connects here first and treats it as
 * "home." The other chains are Gateway *destinations* only: a user can move
 * their Unified Balance to one of these chains, but the app never asks them
 * to connect a wallet on these chains directly.
 */
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  arcTestnet: {
    label: "Arc Testnet",
    chain: arcTestnet,
    domainId: 26,
    usdcAddress: ARC_NATIVE_USDC_ADDRESS,
    explorerUrl: "https://testnet.arcscan.app",
    faucetUrl: "https://faucet.circle.com",
    isPrimary: true,
  },
  sepolia: {
    label: "Ethereum Sepolia",
    chain: sepolia,
    domainId: 0,
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    explorerUrl: "https://sepolia.etherscan.io",
    faucetUrl: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
  },
};

export const PRIMARY_CHAIN_KEY = "arcTestnet" as const;

export function getPrimaryChain(): ChainConfig {
  return SUPPORTED_CHAINS[PRIMARY_CHAIN_KEY]!;
}

/** Helper used by the transfer UI to list valid Gateway destinations (excludes the primary chain itself). */
export function getDestinationChains(): Array<[string, ChainConfig]> {
  return Object.entries(SUPPORTED_CHAINS).filter(
    ([key]) => key !== PRIMARY_CHAIN_KEY,
  );
}

/** Standard minimal ERC-20 ABI -- only the functions this app actually calls. */
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

/** Minimal ABI for the Gateway Wallet contract's deposit function. */
export const GATEWAY_WALLET_ABI = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

/** Minimal ABI for the Gateway Minter contract's mint function. */
export const GATEWAY_MINTER_ABI = [
  {
    type: "function",
    name: "gatewayMint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "attestationPayload", type: "bytes" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

/**
 * config/chains.ts
 *
 * ArcShift multi-chain configuration.
 * Arc Testnet is primary, all others are Gateway destinations.
 * ALL VALUES ARE TESTNET ONLY.
 */

import { defineChain } from "viem";
import type { Chain } from "viem";

/**
 * Ethereum Sepolia - manually defined
 */
export const sepoliaTestnet: Chain = defineChain({
  id: 11155111,
  name: "Ethereum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.infura.io/v3/"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
});

/**
 * Arc Testnet - manually defined
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

/**
 * Base Sepolia - manually defined
 */
export const baseSepoliaTestnet: Chain = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
});

/**
 * Arbitrum Sepolia - manually defined
 */
export const arbitrumSepoliaTestnet: Chain = defineChain({
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] },
  },
  blockExplorers: {
    default: { name: "Arbiscan", url: "https://sepolia.arbiscan.io" },
  },
  testnet: true,
});

/**
 * Optimism Sepolia - manually defined
 */
export const optimismSepoliaTestnet: Chain = defineChain({
  id: 11155420,
  name: "Optimism Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.optimism.io"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia-optimism.etherscan.io" },
  },
  testnet: true,
});

/**
 * Avalanche Fuji Testnet - manually defined
 */
export const avalancheFujiTestnet: Chain = defineChain({
  id: 43113,
  name: "Avalanche Fuji",
  nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.avax-test.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "Snowtrace", url: "https://testnet.snowtrace.io" },
  },
  testnet: true,
});

/**
 * Polygon Amoy Testnet - manually defined
 */
export const polygonAmoyTestnet: Chain = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" },
  },
  testnet: true,
});

/**
 * BNB Chain Testnet - manually defined
 */
export const bscTestnet: Chain = defineChain({
  id: 97,
  name: "BNB Chain Testnet",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://data-seed-prebsc-1-b7b.binance.org:8545"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
});

export const NETWORK_MODE: "testnet" | "mainnet" = "testnet";

export const GATEWAY_WALLET_ADDRESS =
  "0x0077777d7EBA4688BDeF3E311b846F25870A19B9" as const;
export const GATEWAY_MINTER_ADDRESS =
  "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B" as const;

export const GATEWAY_API_BASE = "https://gateway-api-testnet.circle.com";

export const ARC_NATIVE_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;

export interface ChainConfig {
  label: string;
  chain: Chain;
  domainId: number;
  usdcAddress: `0x${string}`;
  explorerUrl: string;
  faucetUrl: string;
  isPrimary?: boolean;
}

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
    chain: sepoliaTestnet,
    domainId: 0,
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    explorerUrl: "https://sepolia.etherscan.io",
    faucetUrl: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
  },
  baseSepoliaTestnet: {
    label: "Base Sepolia",
    chain: baseSepoliaTestnet,
    domainId: 6,
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    explorerUrl: "https://sepolia.basescan.org",
    faucetUrl: "https://www.alchemy.com/faucets/base-sepolia",
  },
  arbitrumSepoliaTestnet: {
    label: "Arbitrum Sepolia",
    chain: arbitrumSepoliaTestnet,
    domainId: 3,
    usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    explorerUrl: "https://sepolia.arbiscan.io",
    faucetUrl: "https://faucets.chain.link/arbitrum-sepolia",
  },
  optimismSepoliaTestnet: {
    label: "Optimism Sepolia",
    chain: optimismSepoliaTestnet,
    domainId: 5,
    usdcAddress: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    explorerUrl: "https://sepolia-optimism.etherscan.io",
    faucetUrl: "https://www.alchemy.com/faucets/optimism-sepolia",
  },
  avalancheFujiTestnet: {
    label: "Avalanche Fuji",
    chain: avalancheFujiTestnet,
    domainId: 1,
    usdcAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
    explorerUrl: "https://testnet.snowtrace.io",
    faucetUrl: "https://faucets.chain.link/fuji",
  },
  polygonAmoyTestnet: {
    label: "Polygon Amoy",
    chain: polygonAmoyTestnet,
    domainId: 7,
    usdcAddress: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    explorerUrl: "https://amoy.polygonscan.com",
    faucetUrl: "https://faucet.polygon.technology",
  },
  bscTestnet: {
    label: "BNB Chain Testnet",
    chain: bscTestnet,
    domainId: 4,
    usdcAddress: "0x64544969ed7EBf5f083679229b7CA3EA8675619f",
    explorerUrl: "https://testnet.bscscan.com",
    faucetUrl: "https://testnet.binance.org/faucet-smart",
  },
};

export const PRIMARY_CHAIN_KEY = "arcTestnet" as const;

export function getPrimaryChain(): ChainConfig {
  return SUPPORTED_CHAINS[PRIMARY_CHAIN_KEY]!;
}

export function getDestinationChains(): Array<[string, ChainConfig]> {
  return Object.entries(SUPPORTED_CHAINS).filter(
    ([key]) => key !== PRIMARY_CHAIN_KEY,
  );
}

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

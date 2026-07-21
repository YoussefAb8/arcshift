import { defineChain } from "viem";
import type { Chain } from "viem";

export const sepoliaTestnet: Chain = defineChain({
  id: 11155111,
  name: "Ethereum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia.org"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://sepolia.etherscan.io" } },
  testnet: true,
});

export const arcTestnet: Chain = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
  blockExplorers: { default: { name: "Arcscan", url: "https://testnet.arcscan.app" } },
  testnet: true,
});

export const baseSepoliaTestnet: Chain = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.base.org"] } },
  blockExplorers: { default: { name: "BaseScan", url: "https://sepolia.basescan.org" } },
  testnet: true,
});

export const arbitrumSepoliaTestnet: Chain = defineChain({
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] } },
  blockExplorers: { default: { name: "Arbiscan", url: "https://sepolia.arbiscan.io" } },
  testnet: true,
});

export const optimismSepoliaTestnet: Chain = defineChain({
  id: 11155420,
  name: "Optimism Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.optimism.io"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://sepolia-optimism.etherscan.io" } },
  testnet: true,
});

export const polygonAmoyTestnet: Chain = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-amoy.polygon.technology"] } },
  blockExplorers: { default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" } },
  testnet: true,
});

export const NETWORK_MODE = "testnet";

export const GATEWAY_WALLET_ADDRESS = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9" as const;
export const GATEWAY_MINTER_ADDRESS = "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B" as const;
export const GATEWAY_API_BASE = "https://gateway-api-testnet.circle.com";
export const ARC_NATIVE_USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

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
    usdcAddress: "0x3600000000000000000000000000000000000000",
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
    faucetUrl: "https://faucet.circle.com",
  },
  baseSepolia: {
    label: "Base Sepolia",
    chain: baseSepoliaTestnet,
    domainId: 6,
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    explorerUrl: "https://sepolia.basescan.org",
    faucetUrl: "https://faucet.circle.com",
  },
  arbitrumSepolia: {
    label: "Arbitrum Sepolia",
    chain: arbitrumSepoliaTestnet,
    domainId: 3,
    usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    explorerUrl: "https://sepolia.arbiscan.io",
    faucetUrl: "https://faucet.circle.com",
  },
  optimismSepolia: {
    label: "Optimism Sepolia",
    chain: optimismSepoliaTestnet,
    domainId: 5,
    usdcAddress: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    explorerUrl: "https://sepolia-optimism.etherscan.io",
    faucetUrl: "https://faucet.circle.com",
  },
  polygonAmoy: {
    label: "Polygon Amoy",
    chain: polygonAmoyTestnet,
    domainId: 7,
    usdcAddress: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    explorerUrl: "https://amoy.polygonscan.com",
    faucetUrl: "https://faucet.circle.com",
  },
};

export const PRIMARY_CHAIN_KEY = "arcTestnet" as const;

export function getPrimaryChain(): ChainConfig {
  return SUPPORTED_CHAINS[PRIMARY_CHAIN_KEY]!;
}

export function getDestinationChains(): Array<[string, ChainConfig]> {
  return Object.entries(SUPPORTED_CHAINS).filter(([key]) => key !== PRIMARY_CHAIN_KEY);
}

export const ERC20_ABI = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
] as const;

export const GATEWAY_WALLET_ABI = [
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "token", type: "address" }, { name: "value", type: "uint256" }], outputs: [] },
] as const;

export const GATEWAY_MINTER_ABI = [
  { type: "function", name: "gatewayMint", stateMutability: "nonpayable", inputs: [{ name: "attestationPayload", type: "bytes" }, { name: "signature", type: "bytes" }], outputs: [] },
] as const;

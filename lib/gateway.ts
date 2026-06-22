/**
 * lib/gateway.ts
 *
 * Service layer for Circle's Gateway protocol. This is where the EIP-712
 * "burn intent" gets built. An EIP-712 signature is a structured, typed
 * message a wallet signs WITHOUT sending a transaction or paying gas --
 * it's proof of intent that Circle's Gateway service then acts on.
 *
 * Flow recap:
 *   1. User deposits USDC into the Gateway Wallet contract (on-chain tx, costs gas).
 *   2. User signs a burn intent (off-chain signature, free) describing
 *      "move X USDC from chain A to chain B, to this recipient."
 *   3. We POST that signed intent to Circle's Gateway API.
 *   4. Gateway returns an attestation proving the burn intent is valid.
 *   5. User submits ONE on-chain transaction on the destination chain,
 *      calling gatewayMint() with that attestation, which credits their balance.
 */

import { type Address, type Hex, pad } from "viem";
import { GATEWAY_API_BASE, GATEWAY_MINTER_ADDRESS, GATEWAY_WALLET_ADDRESS } from "@/config/chains";

const MAX_FEE = 2_010000n; // 2.01 USDC ceiling fee, matches Circle's reference implementation

const EIP712_DOMAIN = { name: "GatewayWallet", version: "1" };

const EIP712_TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
  ],
  TransferSpec: [
    { name: "version", type: "uint32" },
    { name: "sourceDomain", type: "uint32" },
    { name: "destinationDomain", type: "uint32" },
    { name: "sourceContract", type: "bytes32" },
    { name: "destinationContract", type: "bytes32" },
    { name: "sourceToken", type: "bytes32" },
    { name: "destinationToken", type: "bytes32" },
    { name: "sourceDepositor", type: "bytes32" },
    { name: "destinationRecipient", type: "bytes32" },
    { name: "sourceSigner", type: "bytes32" },
    { name: "destinationCaller", type: "bytes32" },
    { name: "value", type: "uint256" },
    { name: "salt", type: "bytes32" },
    { name: "hookData", type: "bytes" },
  ],
  BurnIntent: [
    { name: "maxBlockHeight", type: "uint256" },
    { name: "maxFee", type: "uint256" },
    { name: "spec", type: "TransferSpec" },
  ],
} as const;

function addressToBytes32(address: Address): Hex {
  return pad(address.toLowerCase() as Hex, { size: 32 });
}

export interface BurnIntentParams {
  sourceDomainId: number;
  destinationDomainId: number;
  sourceUsdcAddress: Address;
  destinationUsdcAddress: Address;
  depositorAddress: Address;
  recipientAddress: Address;
  amount: bigint;
}

/** Builds the typed-data object a wallet needs to sign for a Gateway burn intent. */
export function buildBurnIntentTypedData(params: BurnIntentParams) {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const saltHex = ("0x" +
    Array.from(salt)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as Hex;

  const message = {
    maxBlockHeight: (2n ** 256n - 1n).toString(),
    maxFee: MAX_FEE,
    spec: {
      version: 1,
      sourceDomain: params.sourceDomainId,
      destinationDomain: params.destinationDomainId,
      sourceContract: addressToBytes32(GATEWAY_WALLET_ADDRESS),
      destinationContract: addressToBytes32(GATEWAY_MINTER_ADDRESS),
      sourceToken: addressToBytes32(params.sourceUsdcAddress),
      destinationToken: addressToBytes32(params.destinationUsdcAddress),
      sourceDepositor: addressToBytes32(params.depositorAddress),
      destinationRecipient: addressToBytes32(params.recipientAddress),
      sourceSigner: addressToBytes32(params.depositorAddress),
      destinationCaller: addressToBytes32(
        "0x0000000000000000000000000000000000000000",
      ),
      value: params.amount,
      salt: saltHex,
      hookData: "0x" as Hex,
    },
  };

  return {
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: "BurnIntent" as const,
    message,
  };
}

export interface GatewayTransferResponse {
  attestation: Hex;
  signature: Hex;
}

/** Sends a signed burn intent to Circle's Gateway API and returns the mint attestation. */
export async function submitBurnIntent(
  typedDataMessage: unknown,
  signature: Hex,
): Promise<GatewayTransferResponse> {
  const response = await fetch(`${GATEWAY_API_BASE}/v1/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      [{ burnIntent: typedDataMessage, signature }],
      (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    ),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Gateway API rejected the transfer (status ${response.status}). ${text}`,
    );
  }

  return (await response.json()) as GatewayTransferResponse;
}

export interface GatewayBalanceEntry {
  domain: number;
  balance: string;
}

/** Queries Circle's Gateway API for the user's Unified Balance across all configured domains. */
export async function fetchGatewayBalances(
  depositor: Address,
  domainIds: number[],
): Promise<GatewayBalanceEntry[]> {
  const response = await fetch(`${GATEWAY_API_BASE}/v1/balances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: "USDC",
      sources: domainIds.map((domain) => ({ domain, depositor })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Gateway balance lookup failed (status ${response.status})`);
  }

  const data = (await response.json()) as { balances: GatewayBalanceEntry[] };
  return data.balances;
}

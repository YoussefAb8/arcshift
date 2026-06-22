/**
 * lib/usdc.ts
 *
 * USDC always uses 6 decimal places on-chain (1 USDC = 1_000_000 base units).
 * These helpers convert between the human-readable string a user types
 * ("12.50") and the bigint the blockchain actually stores.
 */

const USDC_DECIMALS = 6;

/** Converts a human-typed amount like "12.5" into on-chain base units (bigint). */
export function parseUsdcAmount(value: string): bigint {
  const trimmed = value.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Amount must be a positive number, e.g. 12.50");
  }
  const [whole, decimal = ""] = trimmed.split(".");
  if (decimal.length > USDC_DECIMALS) {
    throw new Error(`USDC supports at most ${USDC_DECIMALS} decimal places`);
  }
  const paddedDecimal = decimal.padEnd(USDC_DECIMALS, "0");
  const combined = `${whole}${paddedDecimal}`;
  return BigInt(combined);
}

/** Converts on-chain base units (bigint) back into a human-readable string. */
export function formatUsdcAmount(value: bigint): string {
  const divisor = 10n ** BigInt(USDC_DECIMALS);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionStr = fraction.toString().padStart(USDC_DECIMALS, "0");
  // Trim trailing zeros but keep at least 2 decimal places for a money-like look.
  const trimmed = fractionStr.replace(/0+$/, "").padEnd(2, "0");
  return `${whole.toString()}.${trimmed}`;
}

/** Validates a recipient address looks like a real EVM address (0x + 40 hex chars). */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/** Validates a typed amount string is usable: positive, parseable, within balance. */
export function validateAmount(
  value: string,
  balance: bigint,
): { ok: true; amount: bigint } | { ok: false; error: string } {
  if (!value.trim()) {
    return { ok: false, error: "Enter an amount" };
  }
  let amount: bigint;
  try {
    amount = parseUsdcAmount(value);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  if (amount <= 0n) {
    return { ok: false, error: "Amount must be greater than zero" };
  }
  if (amount > balance) {
    return { ok: false, error: "Amount exceeds your available balance" };
  }
  return { ok: true, amount };
}

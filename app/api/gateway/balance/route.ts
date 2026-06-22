/**
 * app/api/gateway/balance/route.ts
 *
 * Server-side proxy to Circle's Gateway balance endpoint. We proxy this
 * instead of calling Circle directly from the browser so we have one place
 * to add caching, rate limiting, or error normalization later if needed.
 */
import { NextRequest, NextResponse } from "next/server";
import { fetchGatewayBalances } from "@/lib/gateway";
import { SUPPORTED_CHAINS } from "@/config/chains";
import { isValidEvmAddress } from "@/lib/usdc";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !isValidEvmAddress(address)) {
    return NextResponse.json(
      { error: "A valid 'address' query parameter is required" },
      { status: 400 },
    );
  }

  const domainIds = Object.values(SUPPORTED_CHAINS).map((c) => c.domainId);

  try {
    const balances = await fetchGatewayBalances(
      address as `0x${string}`,
      domainIds,
    );
    return NextResponse.json({ balances });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 502 },
    );
  }
}

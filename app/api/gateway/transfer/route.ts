/**
 * app/api/gateway/transfer/route.ts
 *
 * Server-side proxy that accepts a burn intent the user has ALREADY SIGNED
 * in their browser wallet, and forwards it to Circle's Gateway API. The
 * private key never touches this server -- only the signature does.
 */
import { NextRequest, NextResponse } from "next/server";
import { submitBurnIntent } from "@/lib/gateway";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature } = body as {
      message: unknown;
      signature: `0x${string}`;
    };

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Request must include 'message' and 'signature'" },
        { status: 400 },
      );
    }

    const result = await submitBurnIntent(message, signature);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 502 },
    );
  }
}

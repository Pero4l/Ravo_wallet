import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, rpcUrl } = body;

    if (!address || !rpcUrl) {
      return NextResponse.json(
        { error: "Missing address or rpcUrl" },
        { status: 400 }
      );
    }

    // ⚠️ MUST be JsonRpcProvider on server
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const balance = await provider.getBalance(address);

    return NextResponse.json({
      balance: ethers.formatEther(balance),
    });
  } catch (error) {
  console.error("BALANCE API ERROR:", error);

  let errorMessage = "Unknown error";

  // Narrow the type
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return NextResponse.json(
    {
      error: "Failed to fetch balance",
      message: errorMessage,
    },
    { status: 500 }
  );
}

}

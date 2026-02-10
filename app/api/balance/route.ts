import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: Request) {
  const { address, rpcUrl } = await req.json();

  if (!address || !rpcUrl) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);

  return NextResponse.json({
    balance: ethers.formatEther(balance),
  });
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { address, rpcUrl } = await req.json();

  if (!address || !rpcUrl) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          category: ["external", "internal", "erc20"],
          withMetadata: true,
        },
      ],
    }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

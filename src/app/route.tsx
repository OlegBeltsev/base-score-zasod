import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

export const GET = frames(async (ctx) => {
  const address = ctx.message?.walletAddress || "0x0000000000000000000000000000000000000000";

  let balance = 0;
  let txCount = 0;
  let daysActive = 1;

  try {
    const bal = await fetch(process.env.BASE_RPC_URL || "https://mainnet.base.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    });
    const { result } = await bal.json();
    balance = Number(BigInt(result || "0") / BigInt("1000000000000000000"));

    const tx = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&sort=asc&page=1&offset=1000`);
    const txData = await tx.json();
    if (txData.status === "1" && txData.result?.length > 0) {
      txCount = txData.result.length;
      const first = Number(txData.result[0].timeStamp);
      daysActive = Math.max(1, Math.floor((Date.now() / 1000 - first) / 86400));
    }
  } catch (e) {}

  const score = Math.floor(
    balance * 40 +
    txCount * 10 +
    daysActive * 7 +
    (txCount > 200 ? 3000 : 0) +
    (balance > 1 ? 2000 : 0)
  );

  return {
    image: (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom right, #0052ff, #7e22ce, #ec4899)",
        color: "white",
        fontFamily: "sans-serif",
      }}>
        <h1 style={{ fontSize: "100px", fontWeight: "900", marginBottom: "40px" }}>BASE SCORE</h1>
        <div style={{ fontSize: "140px", fontWeight: "900", marginBottom: "60px" }}>{score}</div>
        <div style={{ fontSize: "48px", opacity: 0.9 }}>
          {balance.toFixed(4)} ETH • {txCount} tx • {daysActive} дней
        </div>
        <div style={{ marginTop: "60px", fontSize: "42px", opacity: 0.7 }}>by @zasod</div>
      </div>
    ),
    imageOptions: { width: 1200, height: 630 },
    buttons: [
      <Button action="post">Обновить</Button>,
      <Button action="link" target={`https://basescan.org/address/${address}`}>BaseScan</Button>,
    ],
  };
});

export const POST = GET;
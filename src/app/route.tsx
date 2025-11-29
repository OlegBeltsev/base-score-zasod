// app/route.tsx — НОВЫЙ РАБОЧИЙ МИНИ-АПП 2025 ГОДА
import { createFrames, Button, TextInput } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  // Если пользователь уже ввёл адрес или подключил кошелёк
  const inputAddress = ctx.message?.input || ctx.message?.address;

  if (inputAddress) {
    // Здесь будет логика подсчёта скора (как раньше, но по введённому адресу)
    let balance = 0;
    let txCount = 0;
    let daysActive = 1;

    try {
      const bal = await fetch("https://mainnet.base.org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [inputAddress, "latest"],
          id: 1,
        }),
      });
      const { result } = await bal.json();
      balance = Number(BigInt(result || "0") / BigInt("1000000000000000000"));

      const tx = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${inputAddress}&sort=asc&page=1&offset=500`);
      const txData = await tx.json();
      if (txData.status === "1" && txData.result?.length > 0) {
        txCount = txData.result.length;
        const first = Number(txData.result[0].timeStamp);
        daysActive = Math.max(1, Math.floor((Date.now() / 1000 - first) / 86400));
      }
    } catch (e) {}

    const score = Math.floor(balance * 40 + txCount * 10 + daysActive * 7 + (txCount > 200 ? 3000 : 0) + (balance > 1 ? 2000 : 0));

    return Response.json({
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-800 text-white">
          <h1 tw="text-9xl font-black mb-8">BASE SCORE</h1>
          <div tw="text-9xl font-black mb-8">{score}</div>
          <div tw="text-5xl opacity-90">{balance.toFixed(4)} ETH • {txCount} tx • {daysActive} дней</div>
          <div tw="mt-12 text-4xl opacity-70">by @zasod</div>
        </div>
      ),
      buttons: [
        <Button action="post">Новый адрес</Button>,
        <Button action="link" target={`https://basescan.org/address/${inputAddress}`}>BaseScan ↗</Button>,
      ],
    });
  }

  // Первый экран — просим ввести адрес
  return Response.json({
    image: (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-indigo-600 to-pink-600 text-white">
        <h1 tw="text-8xl font-black mb-12">BASE SCORE</h1>
        <div tw="text-5xl text-center px-20">Введи адрес Base-кошелька<br/>и узнай свой рейтинг в сети</div>
        <div tw="mt-20 text-4xl opacity-80">by @zasod</div>
      </div>
    ),
    buttons: [
      <Button action="post">Подключить кошелёк</Button>,
    ],
    textInput: "Или вставь адрес вручную...",
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
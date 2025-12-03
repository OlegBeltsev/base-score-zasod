// src/utils/score.ts
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"), // Публичный RPC, rate limit ~100/min — хватит для теста
});

export async function getScoreForAddress(address: `0x${string}`) {
  try {
    // Параллельные запросы для скорости
    const [txCount, balance, blockNumber] = await Promise.all([
      client.getTransactionCount({ address }),
      client.getBalance({ address }),
      client.getBlockNumber(),
    ]);

    const balanceEth = Number(balance) / 1e18; // В ETH
    const ageDays = Math.floor(Number(blockNumber) / (24 * 60 * 60 / 12)); // Примерно дни (блоки ~12s)

    // Формула скора: tx*25 (активность) + balance*120 (богатство) + age*5 (лояльность) + рандом 0-300 (для разнообразия)
    const score = Math.floor(
      txCount * 25 +
      balanceEth * 120 +
      ageDays * 5 +
      Math.random() * 300
    );

    // Рейтинг по баллам
    let rating = "Newbie 🌱";
    if (score > 20000) rating = "God Tier ⚡️";
    else if (score > 10000) rating = "Whale 🐳";
    else if (score > 4000) rating = "Pro 🚀";
    else if (score > 1000) rating = "Active 🔥";

    return { score, rating };
  } catch (error) {
    console.error("Ошибка расчёта скора:", error);
    return { score: 0, rating: "Error 😅" }; // Fallback
  }
}
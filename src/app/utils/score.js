import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function getScoreForAddress(address) {
  try {
    const [txCount, balance, blockNumber] = await Promise.all([
      client.getTransactionCount({ address }),
      client.getBalance({ address }),
      client.getBlockNumber(),
    ]);

    const balanceEth = Number(balance) / 1e18;
    const ageDays = Math.floor(Number(blockNumber) / (24 * 60 * 60 / 12));

    const score = Math.floor(
      txCount * 25 + balanceEth * 120 + ageDays * 5 + Math.random() * 300
    );

    let rating = "Newbie 🌱";
    if (score > 20000) rating = "God Tier ⚡️";
    else if (score > 10000) rating = "Whale 🐳";
    else if (score > 4000) rating = "Pro 🚀";
    else if (score > 1000) rating = "Active 🔥";

    return { score, rating };
  } catch (error) {
    console.error("Ошибка расчёта скора:", error);
    return { score: 0, rating: "Error 😅" };
  }
}
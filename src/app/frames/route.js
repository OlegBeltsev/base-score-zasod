import { createFrames } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import { getScoreForAddress } from "../utils/score";

export const dynamic = "force-dynamic";

const frames = createFrames({
  basePath: "/frames",
  middleware: [farcasterHubContext()],
});

const handleRequest = frames(async (ctx) => {
  const isDebug = ctx.url.searchParams.get("debug") === "true"; const handleRequest = frames(async (ctx) => {
  const sdk = ctx.sdk; // Minikit SDK
  sdk.actions.ready(); // Вызываем ready() для Minikit

  const isDebug = ctx.url.searchParams.get("debug") === "true";
  // остальной код без изменений...
});

  // Debug-режим — показываем, что всё ок
  if (isDebug) {
    return {
      image: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#10b981",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 60,
            fontWeight: "bold",
            textAlign: "center",
            padding: 40,
          }}
        >
          <div>Base Score Frame ✅</div>
          <div style={{ fontSize: 48, marginTop: 40 }}>ВСЁ РАБОТАЕТ!</div>
        </div>
      ),
      buttons: [{ label: "Готово!", action: "post" }],
    };
  }

  // Проверяем валидность сообщения
  if (!ctx.message?.isValid) {
    return {
      image: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 60,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Invalid message
        </div>
      ),
      buttons: [{ label: "Попробовать снова", action: "post" }],
    };
  }

  // Ищем Base-адрес (chainId 8453)
  const verifiedAddresses = ctx.message.requesterVerifiedAddresses || [];
  const chainIds = (ctx.message || {}).requesterVerifiedAddressChainIds || [];

  const baseIndex = chainIds.findIndex((id) => id === 8453);
  const baseAddress = baseIndex !== -1 ? verifiedAddresses[baseIndex] : undefined;

  // Если Base-кошелёк не подключён
  if (!baseAddress) {
    return {
      image: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#3b82f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 68,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <div>Base Score ⚡️</div>
          <div style={{ fontSize: 48, marginTop: 40 }}>
            Подключи кошелёк Base
          </div>
        </div>
      ),
      buttons: [{ label: "Подключить Base", action: "post" }],
    };
  }

  // Есть Base-адрес — считаем скор
  const { score, rating } = await getScoreForAddress(baseAddress);

  return {
    image: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#7c3aed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 56,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.8 }}>
          {baseAddress.slice(0, 6)}...{baseAddress.slice(-4)}
        </div>
        <div style={{ fontSize: 120, fontWeight: "bold", margin: "40px 0" }}>
          {score.toLocaleString()}
        </div>
        <div style={{ fontSize: 80 }}>{rating}</div>
      </div>
    ),
    buttons: [
      { label: "Пересчитать", action: "post" },
      { label: "Поделиться", action: "post_redirect" },
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
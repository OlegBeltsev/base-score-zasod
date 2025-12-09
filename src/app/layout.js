import './globals.css';

export const metadata = {
  title: "Base Score",
  description: "Узнай свой рейтинг в сети Base",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Обязательные embed-теги для Mini Apps 2025 */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:embed" content="v1" />
        <meta property="fc:frame:embed:image" content="https://base-score-zasod-kj5aaivd8-olegbeltsevs-projects.vercel.app/frames" />
        <meta property="fc:frame:embed:button:1" content="🚀 Запустить" />
        <meta property="fc:frame:embed:button:1:action" content="post" />
        <meta property="fc:frame:embed:button:1:target" content="https://base-score-zasod-kj5aaivd8-olegbeltsevs-projects.vercel.app/frames" />
        <meta property="fc:frame:image" content="https://base-score-zasod-kj5aaivd8-olegbeltsevs-projects.vercel.app/frames" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="og:image" content="https://base-score-zasod-kj5aaivd8-olegbeltsevs-projects.vercel.app/frames" />
        <title>Base Score</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
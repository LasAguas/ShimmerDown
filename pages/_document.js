import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/images/logos/favicon-light-32.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/logos/favicon-dark-32.png"
          media="(prefers-color-scheme: dark)"
        />
        {/* Google's search-result favicon: it needs a square icon (multiple of
            48px) with no media query, and ignores the light/dark pair above. */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link
          rel="icon"
          type="image/png"
          href="/images/logos/favicon-search-192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logos/favicon-light-180.png"
        />
        {/* Fonts (Jost + Source Serif 4) are self-hosted via next/font — see
            pages/_app.js. Nothing here talks to Google any more. */}
        <meta name="theme-color" content="#f7f1e7" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

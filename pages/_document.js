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

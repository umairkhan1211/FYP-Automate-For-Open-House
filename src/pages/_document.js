import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* You can add global meta tags here if needed */}
      </Head>
      <body className="antialiased bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

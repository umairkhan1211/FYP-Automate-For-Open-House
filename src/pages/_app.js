import '../styles/globals.css';
import { Toaster } from "react-hot-toast";
import Head from "next/head"; // ✅ Import Head properly

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title >FYP Automate for Open House</title>
        <link rel="icon" type="image/png" href="/QAforfyp.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </Head>
      <Component {...pageProps} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

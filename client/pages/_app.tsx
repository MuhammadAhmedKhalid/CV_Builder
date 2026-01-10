import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { IMAGES } from "@/lib/paths";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CV Builder</title>

        {/* Tab icon / favicon */}
        <link
          rel="icon"
          href={IMAGES.ICON}
          type="image/png"
        />

        <meta name="description" content="Build professional CVs easily" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
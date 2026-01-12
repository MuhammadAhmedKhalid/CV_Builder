import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { IMAGES } from "@/lib/paths";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Head>
        <title>CV Builder</title>
        <link rel="icon" href={IMAGES.ICON} type="image/png" />
        <meta name="description" content="Build professional CVs easily" />
      </Head>

      <Component {...pageProps} />
    </div>
  );
}
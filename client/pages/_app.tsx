import type { AppProps } from "next/app";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CV Builder</title>

        {/* Tab icon / favicon */}
        <link
          rel="icon"
          href="/images/cv_builder_icon.png"
          type="image/png"
        />

        <meta name="description" content="Build professional CVs easily" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
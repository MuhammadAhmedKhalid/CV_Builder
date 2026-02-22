import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { IMAGES } from "@/lib/paths";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <div className={inter.className}>
      <Head>
        <title>CV Builder</title>
        <link rel="icon" href={IMAGES.ICON} type="image/png" />
        <meta name="description" content="Build professional CVs easily" />
      </Head>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </div>
  );
}
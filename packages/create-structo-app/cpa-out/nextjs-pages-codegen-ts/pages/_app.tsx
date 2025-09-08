import '@/styles/globals.css'
import { StructoRootProvider } from "@structoapp/react-web";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StructoRootProvider Head={Head} Link={Link}>
      <Component {...pageProps} />
    </StructoRootProvider>
  );
}

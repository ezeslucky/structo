import '@/styles/globals.css'
import { StructoRootProvider } from "@structoapp/react-web";
import Head from "next/head";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
  return (
    <StructoRootProvider Head={Head} Link={Link}>
      <Component {...pageProps} />
    </StructoRootProvider>
  );
}

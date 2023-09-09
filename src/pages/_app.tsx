import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { SideNav } from "~/components/SideNav";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>DalgasSocial</title>
        <meta name="description" content="This is a social media website for people who can 'dalga' with each other." />
      </Head>
      <div className={`flex mx-auto items-start sm:pr-4 ${inter.className}`}>
        <SideNav />
        <div className="flex-grow min-h-screen border-x border-slate-800">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

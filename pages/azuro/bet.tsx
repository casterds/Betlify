import Link from "next/link";
import "../styles/globals.css";
import React, { ReactNode } from "react";
import * as ethers from "ethers";
import { DAppProvider, Gnosis, useEthers } from "@usedapp/core";
import { AppProps } from "next/app";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-gnosis",
  cache: new InMemoryCache(),
});

const config = {
  readOnlyChainId: Gnosis.chainId,
  readOnlyUrls: {
    // in this tutorial we use Ankr public RPC. It's free and has it's own limits
    // in the production version with a large number of users, we do not recommend using it
    [Gnosis.chainId]: new ethers.providers.StaticJsonRpcProvider(
      "https://rpc.gnosischain.com"
    ),
  },
};
const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  // 'account' being undefined means that user is not connected
  const title = account ? "Disconnect" : "Connect";
  const action = account ? deactivate : activateBrowserWallet;

  return (
    <button className="button" onClick={() => action()}>
      {title}
    </button>
  );
};

type Props = {
  children?: ReactNode;
  // any props that come into the component
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <PageLayout>
          <Component {...pageProps} /> {/* Wrap your app with the Provider */}
        </PageLayout>
      </ApolloProvider>
    </DAppProvider>
  );
}
const PageLayout = ({ children }: Props) => (
  <div className="container pb-12">
    <div className="flex items-center justify-between pt-3 pb-16">
      <div className="text-lg font-semibold">Azuro Betting Website</div>
      <div className="flex space-x-8">
        <div className="text-md">
          <Link href="/">Events</Link>
        </div>

        <div className="text-md">
          <Link href="/bets-history">Bets History</Link>
        </div>
      </div>
      <ConnectButton />
    </div>
    {children}
  </div>
);

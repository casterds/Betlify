import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { DataProvider } from "../contexts/DataContext";
import * as ethers from "ethers";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "../styles/globals.css";
import {
  DAppProvider,
  Gnosis,
  Mainnet,
  Polygon,
  useEthers,
} from "@usedapp/core";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";

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

export const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  // 'account' being undefined means that user is not connected
  const title = account ? "Disconnect" : "Connect";
  const action = account ? deactivate : activateBrowserWallet;

  return (
    <button
      className="button bg-blue-500 text-slate-100 font-bold px-2 rounded-lg hover:bg-blue-700"
      onClick={() => action()}
    >
      {title}
    </button>
  );
};

const apolloClient = new ApolloClient({
  uri: "https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <DAppProvider config={config}>
        <ApolloProvider client={apolloClient}>
          <Navbar connectButton={ConnectButton} />
          <Component {...pageProps} />
        </ApolloProvider>
      </DAppProvider>
    </DataProvider>
  );
}
export default MyApp;

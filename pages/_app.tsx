import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

import { ethers } from "ethers";
import { DataProvider } from "../contexts/DataContext";
import "../styles/globals.css";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
        <Component {...pageProps} /> {/* Wrap your app with the Provider */}
      
    </DataProvider>
  );
}
export default MyApp;

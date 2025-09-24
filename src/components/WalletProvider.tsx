"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { WalletProvider as WalletContextProvider } from "../contexts/WalletContext";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      onError={(error) => {
        console.error("Wallet connection error:", error);
      }}
    >
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </AptosWalletAdapterProvider>
  );
}
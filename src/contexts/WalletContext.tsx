"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  publicKey: string | null;
  walletName: string | null;
  isLoading: boolean;
  disconnect: () => Promise<void>;
  connect: (walletName: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connected, account, disconnect: aptosDisconnect, connect: aptosConnect } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [walletName, setWalletName] = useState<string | null>(null);

  // Initialize wallet state on component mount
  useEffect(() => {
    const initializeWallet = () => {
      if (typeof window !== 'undefined') {
        const savedWalletName = localStorage.getItem('connected-wallet-name');
        if (savedWalletName && connected) {
          setWalletName(savedWalletName);
        }
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, [connected]);

  // Save wallet connection state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (connected && account) {
        localStorage.setItem('wallet-connected', 'true');
        localStorage.setItem('wallet-address', account.address.toString());
        if (account.publicKey) {
          localStorage.setItem('wallet-public-key', account.publicKey.toString());
        }
      } else {
        localStorage.removeItem('wallet-connected');
        localStorage.removeItem('wallet-address');
        localStorage.removeItem('wallet-public-key');
        localStorage.removeItem('connected-wallet-name');
        setWalletName(null);
      }
    }
  }, [connected, account]);

  const handleConnect = async (selectedWalletName: string) => {
    try {
      setIsLoading(true);
      await aptosConnect(selectedWalletName);
      setWalletName(selectedWalletName);
      if (typeof window !== 'undefined') {
        localStorage.setItem('connected-wallet-name', selectedWalletName);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await aptosDisconnect();
      setWalletName(null);
      if (typeof window !== 'undefined') {
        localStorage.clear(); // Clear all wallet-related data
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: WalletContextType = {
    isConnected: connected,
    address: account?.address?.toString() || null,
    publicKey: account?.publicKey?.toString() || null,
    walletName,
    isLoading,
    disconnect: handleDisconnect,
    connect: handleConnect,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

// Hook to check if user should have access to protected routes
export function useWalletAccess() {
  const { isConnected, isLoading } = useWalletContext();
  
  return {
    hasAccess: isConnected,
    isLoading,
    shouldRedirect: !isLoading && !isConnected,
  };
}
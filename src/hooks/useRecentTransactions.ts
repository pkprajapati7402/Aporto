"use client";
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { realWalletAnalyticsService, RecentTransaction } from '../services/realWalletAnalytics';

export interface UseRecentTransactionsReturn {
  transactions: RecentTransaction[];
  isLoading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
}

export function useRecentTransactions(limit: number = 10): UseRecentTransactionsReturn {
  const { account, connected } = useWallet();
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!account?.address || !connected) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const address = account.address.toString();
      const recentTxs = await realWalletAnalyticsService.getRecentTransactions(address, limit);
      setTransactions(recentTxs);
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, connected, limit]);

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (connected && account?.address) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setError(null);
    }
  }, [connected, account?.address, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
  };
}
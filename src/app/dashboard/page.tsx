"use client";

import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletConnectButton } from '../../components/WalletConnect';
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  BarChart3, 
  ArrowLeft,
  Copy,
  CheckCircle,
  ExternalLink,
  Coins,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { connected, account } = useWallet();
  const [addressCopied, setAddressCopied] = useState(false);

  const copyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address.toString());
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  const formatAddress = (address: string | { toString(): string }) => {
    const addressStr = address.toString();
    return `${addressStr.slice(0, 8)}...${addressStr.slice(-6)}`;
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <Wallet className="w-24 h-24 text-purple-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl text-gray-300 mb-8">
              Please connect your Aptos wallet to view your personalized dashboard
            </p>
            
            <WalletConnectButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 relative z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-5 h-5" />
                <Wallet className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Aporto
                </span>
              </Link>
            </div>
            
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to your Dashboard! 🎉</h1>
          <p className="text-xl text-gray-300">
            Your Aptos journey starts here
          </p>
        </div>

        {/* Account Info Card */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Account Information</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-medium">Connected</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Wallet Address</label>
                <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
                  <span className="font-mono text-sm flex-1">
                    {account?.address ? formatAddress(account.address) : 'N/A'}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {addressCopied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {account?.publicKey && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Public Key</label>
                  <div className="bg-black/20 rounded-lg p-3">
                    <span className="font-mono text-sm">
                      {formatAddress(account.publicKey)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Network</label>
                <div className="bg-black/20 rounded-lg p-3">
                  <span className="text-sm">Testnet</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Status</label>
                <div className="bg-black/20 rounded-lg p-3">
                  <span className="text-sm text-green-400">Ready to explore</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <a
              href={`https://explorer.aptoslabs.com/account/${account?.address?.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              View on Explorer <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-8 h-8 text-yellow-400" />
              <span className="text-gray-300">APT Balance</span>
            </div>
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-gray-300">Transactions</span>
            </div>
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-purple-400" />
              <span className="text-gray-300">Badges</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-400">Ready to earn</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-gray-300">Portfolio</span>
            </div>
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-white/10">
            <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Analytics Dashboard</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive insights into your transaction patterns, DeFi activities, and trading behavior.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <span className="text-purple-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-white/10">
            <Award className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Achievement System</h3>
            <p className="text-gray-300 mb-6">
              Unlock unique badges and achievements based on your on-chain activities and milestones.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <span className="text-yellow-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p>🚀 More features are coming soon! Stay tuned for portfolio analytics, achievements, and social features.</p>
        </div>
      </div>
    </div>
  );
}
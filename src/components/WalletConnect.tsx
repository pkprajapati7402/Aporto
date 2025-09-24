"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";

interface WalletInfo {
  name: string;
  icon: string;
  description: string;
  downloadUrl: string;
}

const walletsInfo: Record<string, WalletInfo> = {
  Petra: {
    name: "Petra",
    icon: "🦊",
    description: "Most popular Aptos wallet",
    downloadUrl: "https://petra.app/",
  },
  Pontem: {
    name: "Pontem Wallet",
    icon: "🔧", 
    description: "Developer-friendly wallet",
    downloadUrl: "https://pontem.network/",
  },
  Fewcha: {
    name: "Fewcha",
    icon: "⚡",
    description: "Fast and lightweight wallet",
    downloadUrl: "https://fewcha.app/",
  },
  Nightly: {
    name: "Nightly",
    icon: "🌙",
    description: "Multi-chain wallet",
    downloadUrl: "https://nightly.app/",
  },
};

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { wallets } = useWallet();
  const { isConnected, address, disconnect, connect, isLoading } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showAccount, setShowAccount] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Redirect to dashboard when wallet is connected (only on main page)
  useEffect(() => {
    if (isConnected && address && window.location.pathname === '/') {
      const timer = setTimeout(() => {
        router.push('/dashboard');
        onClose();
      }, 1500); // Give user time to see the success message
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, router, onClose]);

  const handleConnect = async (walletName: string) => {
    try {
      setIsConnecting(walletName);
      await connect(walletName);
      onClose();
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowAccount(false);
      onClose();
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  const formatAddress = (address: string | { toString(): string }) => {
    const addressStr = address.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="modal-overlay-force-top fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm overflow-hidden" 
      style={{zIndex: 2147483647}}
      data-modal="wallet-connect"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-center min-h-full p-4 sm:p-6 lg:p-8">
        <div className="modal-content-force-top relative w-full max-w-lg bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-[99999] bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/10 px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {isConnected && address ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold text-lg">Successfully Connected!</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <span className="text-gray-300 text-sm">Address:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {formatAddress(address)}
                        </span>
                        <button
                          onClick={copyAddress}
                          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        >
                          {addressCopied ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <span className="text-gray-300 text-sm">Wallet:</span>
                      <span className="font-medium">Connected Wallet</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-300 text-sm flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAccount(!showAccount)}
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    {showAccount ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Disconnect
                  </button>
                </div>

                {showAccount && (
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold mb-2">Account Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Full Address:</span>
                        <span className="font-mono text-xs break-all max-w-48">
                          {address}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-300 text-lg mb-2">
                    Choose your preferred Aptos wallet
                  </p>
                  <p className="text-gray-400 text-sm">
                    Connect to get started with your personalized crypto journey
                  </p>
                </div>
                
                <div className="space-y-3">
                  {wallets.map((wallet) => {
                    const walletName = (wallet as { name?: string }).name || "Unknown Wallet";
                    const walletInfo = walletsInfo[walletName] || {
                      name: walletName,
                      icon: "👛",
                      description: "Aptos wallet",
                      downloadUrl: "#",
                    };

                    const isInstalled = wallet.readyState === "Installed";
                    const isWalletConnecting = isConnecting === walletName;

                    return (
                      <div key={walletName} className="group">
                        {isInstalled ? (
                          <button
                            onClick={() => handleConnect(walletName)}
                            disabled={isWalletConnecting}
                            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-600/50 hover:to-gray-700/50 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02] transform"
                          >
                            <div className="text-3xl">{walletInfo.icon}</div>
                            <div className="text-left flex-1">
                              <div className="font-semibold text-lg">{walletInfo.name}</div>
                              <div className="text-sm text-gray-400">{walletInfo.description}</div>
                            </div>
                            {isWalletConnecting ? (
                              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            )}
                          </button>
                        ) : (
                          <div className="w-full flex items-center gap-4 p-4 bg-gray-600/20 rounded-xl border border-gray-500/20">
                            <div className="text-3xl grayscale opacity-50">{walletInfo.icon}</div>
                            <div className="text-left flex-1">
                              <div className="font-semibold text-gray-400">{walletInfo.name}</div>
                              <div className="text-sm text-gray-500">Not installed</div>
                            </div>
                            <a
                              href={walletInfo.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/50 px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium"
                            >
                              Install <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 text-center">
                    New to Aptos wallets? 
                    <a 
                      href="https://petra.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 ml-1 inline-flex items-center gap-1 font-medium"
                    >
                      Get Petra Wallet <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal at document.body level, bypassing z-index issues
  return createPortal(modalContent, document.body);
}

interface WalletButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function WalletConnectButton({ className = "", children }: WalletButtonProps) {
  const { isConnected, address } = useWalletContext();
  const [showModal, setShowModal] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className={`${className} ${
          isConnected
            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 hover:from-green-500/30 hover:to-emerald-500/30"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        } px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
      >
        <Wallet className="w-4 h-4" />
        {isConnected && address ? (
          <>
            <span className="hidden sm:inline">
              {formatAddress(address)}
            </span>
            <span className="sm:hidden">
              Connected
            </span>
          </>
        ) : (
          children || "Connect Wallet"
        )}
      </button>
      
      <WalletConnectModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
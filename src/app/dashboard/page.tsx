"use client";

import React, { useState, useEffect } from 'react';
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
  Activity,
  Zap,
  Shield,
  Target,
  Flame,
  Eye,
  Users,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Sparkles,
  Brain,
  Globe,
  PieChart,
  LineChart,
  DollarSign,
  Percent,
  TrendingDown,
  AlertTriangle,
  CheckSquare,
  RefreshCw,
  Filter,
  Search,
  Settings,
  Share2,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWalletAccess, useWalletContext } from '../../contexts/WalletContext';
import { useProfile, useWalletAnalysis } from '../../hooks/useProfile';
import { useRecentTransactions } from '../../hooks/useRecentTransactions';
import { PERSONALITY_TYPES } from '../../services/aptosProfileService';

export default function AdvancedDashboard() {
  const router = useRouter();
  const { hasAccess, isLoading, shouldRedirect } = useWalletAccess();
  const { isConnected, address, disconnect } = useWalletContext();
  const { profile, isLoading: profileLoading, createProfile, updateProfile, profileExists, isCreatingProfile, isUpdatingProfile } = useProfile();
  const { analysis, isAnalyzing } = useWalletAnalysis();
  const { transactions: recentTransactions, isLoading: transactionsLoading } = useRecentTransactions(5);
  const [addressCopied, setAddressCopied] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [personalityRevealed, setPersonalityRevealed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Redirect if wallet is not connected
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  // Show loading state while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  // Show access denied if wallet is not connected
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Wallet Required</h1>
          <p className="text-gray-300 mb-8">
            Please connect your wallet to access the dashboard and view your crypto personality.
          </p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Connect Wallet
          </Link>
        </div>
      </div>
    );
  }

  // Get real or mock data
  const getRealOrMockData = () => {
    if (profile && profileExists) {
      // Use real profile data from smart contract
      const personalityInfo = PERSONALITY_TYPES[profile.profile.personality_type as keyof typeof PERSONALITY_TYPES] || PERSONALITY_TYPES[5 as keyof typeof PERSONALITY_TYPES];
      
      return {
        account: {
          address: address || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
          balance: profile.profile.portfolio_value.toFixed(2),
          usdValue: (profile.profile.portfolio_value * 8.5).toFixed(2) // Rough APT to USD conversion
        },
        personality: {
          type: personalityInfo.name,
          emoji: personalityInfo.emoji,
          description: personalityInfo.description,
          rarity: `${profile.profile.rarity_percentage}% of users`,
          traits: personalityInfo.traits
        },
        stats: {
          totalTransactions: profile.profile.total_transactions,
          portfolioValue: `$${(profile.profile.portfolio_value * 8.5).toFixed(0)}`,
          totalVolume: `$${(profile.profile.total_volume * 8.5).toFixed(0)}`,
          activeProtocols: profile.profile.active_protocols,
          winRate: `${profile.profile.win_rate}%`,
          bestDay: "+$2,847", // This would need transaction analysis
          riskScore: profile.profile.risk_score / 10,
          diversificationScore: profile.profile.diversification_score / 10
        },
        achievements: profile.achievements,
        recentActivity: [
          { type: "profile", token: "Profile Updated", amount: "On-chain", time: new Date(profile.profile.updated_at * 1000).toLocaleDateString(), profit: "✅" },
          { type: "achievement", token: `${profile.total_achievements_earned} Achievements`, amount: "Earned", time: "Recent", profit: "🏆" },
        ]
      };
    } else if (analysis && !profileExists) {
      // Use wallet analysis data for preview
      const personalityInfo = PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES] || PERSONALITY_TYPES[5 as keyof typeof PERSONALITY_TYPES];
      
      return {
        account: {
          address: address || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
          balance: analysis.balance.apt.toFixed(2),
          usdValue: analysis.balance.usdValue.toFixed(2)
        },
        personality: {
          type: personalityInfo.name + " (Preview)",
          emoji: personalityInfo.emoji,
          description: personalityInfo.description,
          rarity: "Create profile to see rarity",
          traits: personalityInfo.traits
        },
        stats: {
          totalTransactions: analysis.totalTransactions,
          portfolioValue: `$${analysis.balance.usdValue.toFixed(0)}`,
          totalVolume: `$${(analysis.totalVolumeTransacted * 8.5).toFixed(0)}`,
          activeProtocols: analysis.uniqueModulesInteracted,
          winRate: "Create profile to see",
          bestDay: "Create profile to see",
          riskScore: analysis.riskScore / 10,
          diversificationScore: analysis.diversificationScore / 10
        },
        achievements: [],
        recentActivity: [
          { type: "analysis", token: "Wallet Analyzed", amount: `${analysis.totalTransactions} txns`, time: "Just now", profit: "📊" },
          { type: "analysis", token: "Risk Score", amount: `${analysis.riskScore}/100`, time: "Current", profit: analysis.riskScore > 70 ? "⚠️" : "✅" },
          { type: "analysis", token: "Activity Trend", amount: analysis.activityTrend, time: "30 days", profit: analysis.activityTrend === 'increasing' ? "📈" : analysis.activityTrend === 'decreasing' ? "📉" : "➡️" },
        ]
      };
    } else {
      // Fallback to mock data
      return {
        account: {
          address: address || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
          balance: "1,247.89",
          usdValue: "12,478.90"
        },
        personality: {
          type: "Connect Wallet",
          emoji: "🔗",
          description: "Connect your wallet to discover your crypto personality",
          rarity: "Waiting...",
          traits: ["Curious", "Ready to Explore", "Crypto Enthusiast"]
        },
        stats: {
          totalTransactions: 0,
          portfolioValue: "$0",
          totalVolume: "$0",
          activeProtocols: 0,
          winRate: "0%",
          bestDay: "$0",
          riskScore: 0,
          diversificationScore: 0
        },
        achievements: [],
        recentActivity: []
      };
    }
  };

  const mockData = getRealOrMockData();

  const achievements = [
    { name: "First Steps", description: "Made first transaction", rarity: "Common", earned: true, emoji: "👶", progress: 100 },
    { name: "Century Club", description: "100+ transactions", rarity: "Uncommon", earned: true, emoji: "💯", progress: 100 },
    { name: "DeFi Explorer", description: "Used 10+ protocols", rarity: "Rare", earned: true, emoji: "🗺️", progress: 100 },
    { name: "Whale Status", description: "Portfolio > $10k", rarity: "Epic", earned: true, emoji: "🐋", progress: 100 },
    { name: "Diamond Hands", description: "Hold 6+ months", rarity: "Legendary", earned: false, emoji: "💎", progress: 67 },
    { name: "Yield Master", description: "Earn $1000+ in yield", rarity: "Legendary", earned: false, emoji: "🌾", progress: 23 },
  ];

  const portfolioData = [
    { name: "APT", value: 45, amount: "$21,276", change: "+12.3%" },
    { name: "USDC", value: 25, amount: "$11,848", change: "0.0%" },
    { name: "LP Tokens", value: 20, amount: "$9,478", change: "+5.7%" },
    { name: "NFTs", value: 10, amount: "$4,739", change: "-2.1%" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Trigger personality reveal animation after component mounts
    const timer = setTimeout(() => setPersonalityRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      router.push('/');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  // Show loading screen while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 218, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 218, 0.7);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Futuristic Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-cyan-500/20 relative z-40 shadow-lg shadow-cyan-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <Wallet className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  WalletPersona
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">LIVE</span>
              </div>
              <div className="text-sm text-gray-300">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-300 hidden sm:block">
                  {formatAddress(address || '')}
                </div>
                <button 
                  onClick={handleDisconnect}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Creation Section - Compact */}
        {!profileExists && !profileLoading && (
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🚀</div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Create On-Chain Profile
                  </h3>
                  <p className="text-sm text-gray-400">Mint your wallet personality on Aptos</p>
                </div>
              </div>
              
              {analysis ? (
                <div className="flex items-center gap-4">
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50 text-center">
                    <div className="text-xl mb-1">{PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES]?.emoji || '🔮'}</div>
                    <p className="text-xs font-medium">{PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES]?.name || 'Crypto Explorer'}</p>
                    <p className="text-xs text-gray-500">Confidence: {analysis.calculatedPersonality.confidence}%</p>
                    <p className="text-xs text-gray-500">{analysis.totalTransactions} transactions analyzed</p>
                  </div>
                  <button
                    onClick={createProfile}
                    disabled={isCreatingProfile}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isCreatingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Mint Profile
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isAnalyzing && (
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <p className="text-sm text-gray-400">Analyzing wallet...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Personality Reveal Section */}
        {profileExists && (
          <div className={`transform transition-all duration-1000 ${personalityRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl p-8 border border-cyan-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4 animate-bounce">{mockData.personality.emoji}</div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  You're a {mockData.personality.type}!
                </h1>
                <p className="text-xl text-gray-300 mb-4">{mockData.personality.description}</p>
                <div className="flex justify-center gap-2 mb-4">
                  {mockData.personality.traits.map((trait, index) => (
                    <span key={index} className="bg-black/30 px-3 py-1 rounded-full text-sm border border-cyan-500/30">
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-cyan-400 font-medium">Rare personality - only {mockData.personality.rarity}</p>
                
                {/* Profile Management Actions */}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={updateProfile}
                    disabled={isUpdatingProfile}
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Update Profile
                      </>
                    )}
                  </button>
                  
                  <a
                    href={`https://explorer.aptoslabs.com/account/${address || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View On-Chain
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Loading State */}
        {profileLoading && (
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl p-8 border border-cyan-500/20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Loading Your Profile</h2>
              <p className="text-gray-300">Fetching data from the blockchain...</p>
            </div>
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 auto-rows-min">
          {/* Stats Cards - Row 1 */}
          {[
            { 
              title: "Portfolio Value", 
              value: mockData.stats.portfolioValue, 
              change: analysis ? `${analysis.activityTrend === 'increasing' ? '+' : analysis.activityTrend === 'decreasing' ? '-' : ''}${((analysis.transactionsLast7Days / Math.max(analysis.transactionsLast30Days - analysis.transactionsLast7Days, 1)) * 100).toFixed(1)}%` : "+12.5%", 
              icon: <DollarSign className="w-5 h-5" />, 
              color: "from-green-500 to-emerald-500",
              trend: analysis?.activityTrend === 'increasing' ? 'up' : analysis?.activityTrend === 'decreasing' ? 'down' : 'neutral',
              colSpan: "col-span-12 sm:col-span-6 lg:col-span-3"
            },
            { 
              title: "Total Transactions", 
              value: analysis ? analysis.totalTransactions.toString() : mockData.stats.totalTransactions.toString(), 
              change: analysis ? `${analysis.transactionsLast7Days} this week` : "+234.7%", 
              icon: <BarChart3 className="w-5 h-5" />, 
              color: "from-blue-500 to-cyan-500",
              trend: "up",
              colSpan: "col-span-12 sm:col-span-6 lg:col-span-3"
            },
            { 
              title: "Active Protocols", 
              value: mockData.stats.activeProtocols.toString(), 
              change: analysis ? `Risk: ${analysis.riskScore}/100` : "Top 5%", 
              icon: <Globe className="w-5 h-5" />, 
              color: "from-purple-500 to-pink-500",
              trend: "neutral",
              colSpan: "col-span-12 sm:col-span-6 lg:col-span-3"
            },
            { 
              title: "Account Age", 
              value: analysis ? `${analysis.accountAge} days` : mockData.stats.winRate, 
              change: analysis ? `${analysis.successfulTransactions}/${analysis.totalTransactions} success` : "Excellent", 
              icon: <Target className="w-5 h-5" />, 
              color: "from-orange-500 to-red-500",
              trend: "up",
              colSpan: "col-span-12 sm:col-span-6 lg:col-span-3"
            }
          ].map((stat, index) => (
            <div key={index} className={`${stat.colSpan} group`}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-5 rounded-2xl border border-gray-700/30 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-xl h-full relative overflow-hidden">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-400" />}
                      {stat.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-400" />}
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-cyan-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.title}</div>
                  
                  {/* Animated progress bar */}
                  <div className="mt-3 h-0.5 bg-gray-700/50 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 group-hover:animate-pulse`} 
                         style={{width: `${Math.random() * 40 + 60}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Portfolio Analysis - Large Card */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl h-fit relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Portfolio Analysis</h3>
                  <div className="flex gap-1">
                    {['1d', '7d', '30d', '1y'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setActiveTimeframe(period)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTimeframe === period 
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Portfolio Donut Chart Simulation */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="w-40 h-40 mx-auto relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#374151" strokeWidth="12"/>
                        {portfolioData.map((item, index) => {
                          const circumference = 2 * Math.PI * 65;
                          const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                          const rotation = portfolioData.slice(0, index).reduce((sum, prev) => sum + prev.value, 0) * 3.6;
                          return (
                            <circle
                              key={index}
                              cx="80"
                              cy="80"
                              r="65"
                              fill="none"
                              stroke={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]}
                              strokeWidth="12"
                              strokeDasharray={strokeDasharray}
                              strokeLinecap="round"
                              transform={`rotate(${rotation} 80 80)`}
                              className="transition-all duration-1000"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xl font-bold">{mockData.stats.portfolioValue}</div>
                        <div className="text-xs text-gray-400">Total Value</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {portfolioData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]}}
                          ></div>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">{item.amount}</div>
                          <div className={`text-xs ${item.change.startsWith('+') ? 'text-green-400' : item.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Tall Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl h-fit relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Recent Activity</h3>
                  <RefreshCw className="w-4 h-4 text-cyan-400 cursor-pointer hover:rotate-180 transition-transform duration-500" />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {transactionsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-gray-400">Loading transactions...</p>
                    </div>
                  ) : recentTransactions.length > 0 ? (
                    recentTransactions.map((tx, index) => (
                      <div key={tx.hash} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                          tx.type === 'transfer' ? 'bg-green-500/20 text-green-400' :
                          tx.type === 'stake' ? 'bg-purple-500/20 text-purple-400' :
                          tx.type === 'liquidity' ? 'bg-cyan-500/20 text-cyan-400' :
                          tx.type === 'nft' ? 'bg-pink-500/20 text-pink-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {tx.type === 'swap' && <ArrowLeft className="w-3 h-3 rotate-45" />}
                          {tx.type === 'transfer' && <ArrowLeft className="w-3 h-3" />}
                          {tx.type === 'liquidity' && <Coins className="w-3 h-3" />}
                          {tx.type === 'stake' && <Zap className="w-3 h-3" />}
                          {tx.type === 'nft' && <Star className="w-3 h-3" />}
                          {tx.type === 'other' && <Activity className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{tx.description}</div>
                          <div className="text-xs text-gray-400">{tx.gasUsed} gas used</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium text-xs ${
                            tx.status === 'success' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tx.status === 'success' ? '✅' : '❌'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {tx.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    mockData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                          activity.type === 'liquidity' ? 'bg-green-500/20 text-green-400' :
                          activity.type === 'stake' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {activity.type === 'swap' && <ArrowLeft className="w-3 h-3 rotate-45" />}
                          {activity.type === 'liquidity' && <Coins className="w-3 h-3" />}
                          {activity.type === 'stake' && <Zap className="w-3 h-3" />}
                          {activity.type === 'nft' && <Star className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{activity.token}</div>
                          <div className="text-xs text-gray-400">{activity.amount}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium text-xs ${activity.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {activity.profit}
                          </div>
                          <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Performance Chart */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Trading Performance</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs">Profit</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs">Loss</span>
                    </div>
                  </div>
                </div>
                
                {/* Simulated Chart */}
                <div className="h-48 relative mb-6">
                  <svg className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <line key={i} x1="0" y1={i * 48} x2="100%" y2={i * 48} stroke="#374151" strokeWidth="1" opacity="0.3"/>
                    ))}
                    {/* Performance line */}
                    <polyline
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      points="0,150 50,120 100,100 150,85 200,70 250,60 300,50 350,40 400,35"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Chart labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                  </div>
                </div>
                
                {/* Performance metrics */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">+47.3%</div>
                    <div className="text-xs text-gray-400">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">1.34</div>
                    <div className="text-xs text-gray-400">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">73%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">12.5%</div>
                    <div className="text-xs text-gray-400">Max Drawdown</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements - Medium Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Achievements</h3>
                  <span className="text-cyan-400 text-xs bg-cyan-500/10 px-2 py-1 rounded-full">4/6 Earned</span>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {achievements.slice(0, 4).map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-xl border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                        : 'bg-black/20 border-gray-700/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`text-xl ${achievement.earned ? 'animate-pulse' : 'grayscale'}`}>
                          {achievement.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{achievement.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              achievement.rarity === 'Common' ? 'bg-gray-500/20 text-gray-400' :
                              achievement.rarity === 'Uncommon' ? 'bg-green-500/20 text-green-400' :
                              achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                              achievement.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mb-2">{achievement.description}</div>
                          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-1000 ${
                                achievement.earned ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                              }`}
                              style={{width: `${achievement.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Analysis & AI Insights */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold">Risk Analysis</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Risk Score</span>
                      <span className="font-bold text-orange-400">{mockData.stats.riskScore}/10</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full" 
                           style={{width: `${mockData.stats.riskScore * 10}%`}}></div>
                    </div>
                    <span className="text-xs text-orange-400 mt-1">Moderate-High Risk</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Diversification</span>
                      <span className="font-bold text-green-400">{mockData.stats.diversificationScore}/10</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full" 
                           style={{width: `${mockData.stats.diversificationScore * 10}%`}}></div>
                    </div>
                    <span className="text-xs text-green-400 mt-1">Well Diversified</span>
                  </div>

                  {/* Risk factors */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Risk Factors</h4>
                    {[
                      { factor: "High DeFi Exposure", level: "Medium", color: "text-yellow-400" },
                      { factor: "Leverage Usage", level: "Low", color: "text-green-400" },
                      { factor: "New Protocol Risk", level: "High", color: "text-red-400" }
                    ].map((risk, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{risk.factor}</span>
                        <span className={`font-medium ${risk.color}`}>{risk.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Trading */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold">Social Trading</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Similar Traders</h4>
                    <div className="space-y-2">
                      {[
                        { name: "CryptoPioneer", similarity: "94%", performance: "+47.3%", followers: "2.3k" },
                        { name: "DeFiWhale", similarity: "89%", performance: "+31.7%", followers: "1.8k" },
                        { name: "YieldHunter", similarity: "87%", performance: "+28.9%", followers: "1.2k" }
                      ].map((trader, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">
                              {trader.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{trader.name}</div>
                              <div className="text-xs text-gray-400">{trader.similarity} similar</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-medium text-sm">{trader.performance}</div>
                            <div className="text-xs text-gray-400">{trader.followers} followers</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-700/50">
                    <h4 className="font-semibold mb-2 text-sm">Your Influence</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-lg font-bold text-cyan-400">127</div>
                        <div className="text-xs text-gray-400">Followers</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">23</div>
                        <div className="text-xs text-gray-400">Copiers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information - Enhanced Bento Card */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/20 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Account Information</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium text-sm">Connected</span>
                </div>
                <button className="p-2 bg-black/20 rounded-lg border border-gray-600/50 hover:border-cyan-500/50 transition-all">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Wallet Address</label>
                  <div className="flex items-center gap-2 bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <span className="font-mono text-sm flex-1">
                      {formatAddress(mockData.account.address)}
                    </span>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {addressCopied ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">APT Balance</label>
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{mockData.account.balance} APT</span>
                      <span className="text-xs text-gray-400">${mockData.account.usdValue}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Network Status</label>
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400">Mainnet Active</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Last Activity</label>
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <span className="text-sm">2 minutes ago</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Profile Views</label>
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span className="text-sm">247 this week</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Reputation Score</label>
                  <div className="bg-black/20 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm font-bold">8.7/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-700/50">
              <a
                href={`https://explorer.aptoslabs.com/account/${address || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-medium"
              >
                <ExternalLink className="w-3 h-3" />
                View on Explorer
              </a>
              
              <button className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-medium">
                <Share2 className="w-3 h-3" />
                Share Profile
              </button>
              
              <button className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-medium">
                <Download className="w-3 h-3" />
                Export Data
              </button>
            </div>
          </div>
        </div>



        {/* Footer Stats */}
        <div className="text-center text-gray-400 space-y-4">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Last updated: {currentTime.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Data secured with end-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Connected to 47 protocols across Aptos</span>
            </div>
          </div>
          <p className="text-xs">🚀 Your crypto journey is unique - keep building, keep growing!</p>
        </div>
      </div>
      </div>
    </>
  );
}
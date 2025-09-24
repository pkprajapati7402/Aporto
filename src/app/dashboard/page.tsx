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
        {/* Profile Creation Section */}
        {!profileExists && !profileLoading && (
          <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-cyan-500/30 overflow-hidden">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Create Your On-Chain Profile
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Mint your wallet personality and achievements on the Aptos blockchain
              </p>
              {analysis ? (
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Preview based on wallet analysis:</p>
                  <div className="bg-black/30 rounded-xl p-4 border border-gray-700 inline-block">
                    <div className="text-2xl mb-2">{PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES]?.emoji || '🔮'}</div>
                    <p className="font-medium">{PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES]?.name || 'Crypto Explorer'}</p>
                    <p className="text-xs text-gray-400">Confidence: {analysis.calculatedPersonality.confidence}%</p>
                    <p className="text-sm text-gray-400">{analysis.totalTransactions} transactions analyzed</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-400">Analyzing your wallet to determine personality type...</p>
                  {isAnalyzing && (
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
                  )}
                </div>
              )}
              <button
                onClick={createProfile}
                disabled={isCreatingProfile || !analysis}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center gap-3"
              >
                {isCreatingProfile ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Mint My Profile
                  </>
                )}
              </button>
              {!analysis && !isAnalyzing && (
                <p className="text-sm text-red-400 mt-4">
                  Please wait for wallet analysis to complete before creating profile
                </p>
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

        {/* Real-time Stats Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {[
            { 
              title: "Portfolio Value", 
              value: mockData.stats.portfolioValue, 
              change: analysis ? `${analysis.activityTrend === 'increasing' ? '+' : analysis.activityTrend === 'decreasing' ? '-' : ''}${((analysis.transactionsLast7Days / Math.max(analysis.transactionsLast30Days - analysis.transactionsLast7Days, 1)) * 100).toFixed(1)}%` : "+12.5%", 
              icon: <DollarSign className="w-6 h-6" />, 
              color: "from-green-500 to-emerald-500",
              trend: analysis?.activityTrend === 'increasing' ? 'up' : analysis?.activityTrend === 'decreasing' ? 'down' : 'neutral'
            },
            { 
              title: "Total Transactions", 
              value: analysis ? analysis.totalTransactions.toString() : mockData.stats.totalTransactions.toString(), 
              change: analysis ? `${analysis.transactionsLast7Days} this week` : "+234.7%", 
              icon: <BarChart3 className="w-6 h-6" />, 
              color: "from-blue-500 to-cyan-500",
              trend: "up"
            },
            { 
              title: "Active Protocols", 
              value: mockData.stats.activeProtocols.toString(), 
              change: analysis ? `Risk: ${analysis.riskScore}/100` : "Top 5%", 
              icon: <Globe className="w-6 h-6" />, 
              color: "from-purple-500 to-pink-500",
              trend: "neutral"
            },
            { 
              title: "Account Age", 
              value: analysis ? `${analysis.accountAge} days` : mockData.stats.winRate, 
              change: analysis ? `${analysis.successfulTransactions}/${analysis.totalTransactions} success` : "Excellent", 
              icon: <Target className="w-6 h-6" />, 
              color: "from-orange-500 to-red-500",
              trend: "up"
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-400" />}
                    {stat.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-400" />}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-cyan-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
                
                {/* Animated progress bar */}
                <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full animate-pulse`} 
                       style={{width: `${Math.random() * 40 + 60}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Portfolio Breakdown */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Portfolio Analysis</h3>
                <div className="flex gap-2">
                  {['1d', '7d', '30d', '1y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setActiveTimeframe(period)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeTimeframe === period 
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Portfolio Donut Chart Simulation */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="w-48 h-48 mx-auto relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="80" fill="none" stroke="#374151" strokeWidth="16"/>
                      {portfolioData.map((item, index) => {
                        const circumference = 2 * Math.PI * 80;
                        const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                        const rotation = portfolioData.slice(0, index).reduce((sum, prev) => sum + prev.value, 0) * 3.6;
                        return (
                          <circle
                            key={index}
                            cx="96"
                            cy="96"
                            r="80"
                            fill="none"
                            stroke={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]}
                            strokeWidth="16"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            transform={`rotate(${rotation} 96 96)`}
                            className="transition-all duration-1000"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{mockData.stats.portfolioValue}</div>
                        <div className="text-sm text-gray-400">Total Value</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {portfolioData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]}}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.amount}</div>
                        <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-400' : item.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                          {item.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Performance Chart */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Trading Performance</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Profit</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm">Loss</span>
                  </div>
                </div>
              </div>
              
              {/* Simulated Chart */}
              <div className="h-64 relative">
                <svg className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 64} x2="100%" y2={i * 64} stroke="#374151" strokeWidth="1" opacity="0.3"/>
                  ))}
                  {/* Performance line */}
                  <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    points="0,200 50,150 100,120 150,100 200,80 250,70 300,60 350,50 400,45"
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
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-400 px-4">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>
              
              {/* Performance metrics */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">+47.3%</div>
                  <div className="text-sm text-gray-400">Total Return</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">1.34</div>
                  <div className="text-sm text-gray-400">Sharpe Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">73%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">12.5%</div>
                  <div className="text-sm text-gray-400">Max Drawdown</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activities & Achievements */}
          <div className="space-y-8">
            
            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-6 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <RefreshCw className="w-5 h-5 text-cyan-400 cursor-pointer hover:rotate-180 transition-transform duration-500" />
              </div>
              
              <div className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-400">Loading transactions...</p>
                  </div>
                ) : recentTransactions.length > 0 ? (
                  recentTransactions.map((tx, index) => (
                    <div key={tx.hash} className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                        tx.type === 'transfer' ? 'bg-green-500/20 text-green-400' :
                        tx.type === 'stake' ? 'bg-purple-500/20 text-purple-400' :
                        tx.type === 'liquidity' ? 'bg-cyan-500/20 text-cyan-400' :
                        tx.type === 'nft' ? 'bg-pink-500/20 text-pink-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {tx.type === 'swap' && <ArrowLeft className="w-4 h-4 rotate-45" />}
                        {tx.type === 'transfer' && <ArrowLeft className="w-4 h-4" />}
                        {tx.type === 'liquidity' && <Coins className="w-4 h-4" />}
                        {tx.type === 'stake' && <Zap className="w-4 h-4" />}
                        {tx.type === 'nft' && <Star className="w-4 h-4" />}
                        {tx.type === 'other' && <Activity className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tx.description}</div>
                        <div className="text-sm text-gray-400">{tx.gasUsed} gas used</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
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
                    <div key={index} className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'liquidity' ? 'bg-green-500/20 text-green-400' :
                        activity.type === 'stake' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {activity.type === 'swap' && <ArrowLeft className="w-4 h-4 rotate-45" />}
                        {activity.type === 'liquidity' && <Coins className="w-4 h-4" />}
                        {activity.type === 'stake' && <Zap className="w-4 h-4" />}
                        {activity.type === 'nft' && <Star className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{activity.token}</div>
                        <div className="text-sm text-gray-400">{activity.amount}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${activity.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {activity.profit}
                        </div>
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-6 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Achievements</h3>
                <span className="text-cyan-400 text-sm">4/6 Earned</span>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-xl border transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                      : 'bg-black/30 border-gray-700'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${achievement.earned ? 'animate-pulse' : 'grayscale'}`}>
                        {achievement.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{achievement.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            achievement.rarity === 'Common' ? 'bg-gray-500/20 text-gray-400' :
                            achievement.rarity === 'Uncommon' ? 'bg-green-500/20 text-green-400' :
                            achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                            achievement.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">{achievement.description}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
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

            {/* Risk Analysis */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-6 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold">Risk Analysis</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Risk Score</span>
                    <span className="font-bold text-orange-400">{mockData.stats.riskScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-3 rounded-full" 
                         style={{width: `${mockData.stats.riskScore * 10}%`}}></div>
                  </div>
                  <span className="text-xs text-orange-400 mt-1">Moderate-High Risk</span>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Diversification</span>
                    <span className="font-bold text-green-400">{mockData.stats.diversificationScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-3 rounded-full" 
                         style={{width: `${mockData.stats.diversificationScore * 10}%`}}></div>
                  </div>
                  <span className="text-xs text-green-400 mt-1">Well Diversified</span>
                </div>

                {/* Risk factors */}
                <div className="space-y-3">
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

        {/* Account Information - Enhanced */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl p-8 border border-cyan-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Account Information</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
              <button className="p-2 bg-black/30 rounded-lg border border-gray-600 hover:border-cyan-500/50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Wallet Address</label>
                <div className="flex items-center gap-2 bg-black/30 rounded-xl p-4 border border-gray-700">
                  <span className="font-mono text-sm flex-1">
                    {formatAddress(mockData.account.address)}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {addressCopied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">APT Balance</label>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{mockData.account.balance} APT</span>
                    <span className="text-sm text-gray-400">${mockData.account.usdValue}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Network Status</label>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Mainnet Active</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Last Activity</label>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                  <span className="text-sm">2 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Profile Views</label>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">247 this week</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Reputation Score</label>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold">8.7/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-700">
            <a
              href={`https://explorer.aptoslabs.com/account/${address || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/50 px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
            
            <button className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium">
              <Share2 className="w-4 h-4" />
              Share Profile
            </button>
            
            <button className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/50 px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Trading Insights Panel */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold">AI Trading Insights</h3>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">BETA</span>
            </div>
            
            <div className="space-y-6">
              {analysis ? (
                <>
                  <div className={`p-4 bg-gradient-to-r rounded-xl border ${
                    analysis.calculatedPersonality.confidence > 80 
                      ? 'from-green-500/10 to-emerald-500/10 border-green-500/30'
                      : analysis.calculatedPersonality.confidence > 60
                      ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                      : 'from-orange-500/10 to-yellow-500/10 border-orange-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Personality Analysis</h4>
                        <p className="text-sm text-gray-300 mb-2">
                          Based on {analysis.totalTransactions} transactions across {analysis.uniqueModulesInteracted} protocols, you're classified as a {PERSONALITY_TYPES[analysis.calculatedPersonality.type as keyof typeof PERSONALITY_TYPES]?.name} with {analysis.calculatedPersonality.confidence}% confidence.
                        </p>
                        <div className="text-xs text-gray-400">
                          Reasons: {analysis.calculatedPersonality.reasons.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 bg-gradient-to-r rounded-xl border ${
                    analysis.activityTrend === 'increasing'
                      ? 'from-green-500/10 to-emerald-500/10 border-green-500/30'
                      : analysis.activityTrend === 'decreasing'
                      ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
                      : 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Activity Pattern</h4>
                        <p className="text-sm text-gray-300">
                          Your activity is {analysis.activityTrend}. You're most active at {analysis.mostActiveHour}:00 UTC and had {analysis.transactionsLast7Days} transactions in the last week.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 bg-gradient-to-r rounded-xl border ${
                    analysis.riskScore > 70 
                      ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
                      : analysis.riskScore > 40
                      ? 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                      : 'from-green-500/10 to-emerald-500/10 border-green-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-2">Risk Assessment</h4>
                        <p className="text-sm text-gray-300">
                          Risk Score: {analysis.riskScore}/100. You've used {analysis.uniqueModulesInteracted} different protocols with a {((analysis.successfulTransactions / Math.max(analysis.totalTransactions, 1)) * 100).toFixed(1)}% success rate.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Pattern Recognition</h4>
                        <p className="text-sm text-gray-300">
                          Connect your wallet to see personalized insights based on your actual transaction history and behavior patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Optimization Opportunity</h4>
                        <p className="text-sm text-gray-300">
                          Real-time analysis of your trading patterns will help identify optimal trading windows and strategies.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-2">Risk Assessment</h4>
                        <p className="text-sm text-gray-300">
                          Get personalized risk analysis based on your portfolio diversification and trading behavior.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Social Trading */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold">Social Trading</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Similar Traders</h4>
                <div className="space-y-3">
                  {[
                    { name: "CryptoPioneer", similarity: "94%", performance: "+47.3%", followers: "2.3k" },
                    { name: "DeFiWhale", similarity: "89%", performance: "+31.7%", followers: "1.8k" },
                    { name: "YieldHunter", similarity: "87%", performance: "+28.9%", followers: "1.2k" }
                  ].map((trader, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {trader.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{trader.name}</div>
                          <div className="text-xs text-gray-400">{trader.similarity} similar</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{trader.performance}</div>
                        <div className="text-xs text-gray-400">{trader.followers} followers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h4 className="font-semibold mb-3">Your Influence</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-black/30 rounded-lg">
                    <div className="text-xl font-bold text-cyan-400">127</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-black/30 rounded-lg">
                    <div className="text-xl font-bold text-purple-400">23</div>
                    <div className="text-xs text-gray-400">Copiers</div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 py-3 rounded-xl hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 font-medium">
                  Enable Copy Trading
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Market Sentiment & News */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Market Pulse</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Feed</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fear & Greed Index */}
            <div className="text-center">
              <h4 className="font-semibold mb-4">Fear & Greed Index</h4>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#374151" strokeWidth="8"/>
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={`${73 * 3.51} 351`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-green-400">73</div>
                  <div className="text-xs text-gray-400">Greed</div>
                </div>
              </div>
              <p className="text-sm text-gray-300">Market is in greed mode - be cautious of FOMO</p>
            </div>
            
            {/* Top Movers */}
            <div>
              <h4 className="font-semibold mb-4">Top Movers (24h)</h4>
              <div className="space-y-3">
                {[
                  { symbol: "APT", change: "+23.4%", price: "$12.34" },
                  { symbol: "USDC", change: "0.0%", price: "$1.00" },
                  { symbol: "CAKE", change: "-8.7%", price: "$2.89" },
                  { symbol: "BNB", change: "+15.2%", price: "$234.56" }
                ].map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{token.price}</span>
                      <span className={`text-sm font-medium ${
                        token.change.startsWith('+') ? 'text-green-400' : 
                        token.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {token.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick News */}
            <div>
              <h4 className="font-semibold mb-4">Latest News</h4>
              <div className="space-y-3">
                {[
                  { title: "Aptos announces major DeFi partnership", time: "2h ago", impact: "bullish" },
                  { title: "New governance proposal goes live", time: "4h ago", impact: "neutral" },
                  { title: "TVL hits new all-time high", time: "6h ago", impact: "bullish" }
                ].map((news, index) => (
                  <div key={index} className="p-3 bg-black/30 rounded-lg border-l-2 border-cyan-500/50">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium flex-1">{news.title}</p>
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        news.impact === 'bullish' ? 'bg-green-400' :
                        news.impact === 'bearish' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{news.time}</p>
                  </div>
                ))}
              </div>
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
  );
}
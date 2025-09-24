"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Share2, 
  Shield, 
  ArrowRight, 
  Menu, 
  X, 
  Play, 
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  Users,
  Brain,
  Eye,
  Target,
  Clock,
  Star,
  Lock,
  Database,
  Layers,
  Smartphone,
  Monitor,
  Palette,
  Heart
} from 'lucide-react';
import { WalletConnectButton } from '../components/WalletConnect';
import { useWalletContext } from '../contexts/WalletContext';

const EnhancedModernLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const { isConnected } = useWalletContext();

  // Enhanced features with more detail
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze your transaction patterns to reveal hidden insights about your trading behavior and personality",
      details: ["Pattern Recognition", "Behavioral Analysis", "Predictive Insights", "Risk Assessment"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Dynamic Achievement System",
      description: "Unlock rare on-chain badges and NFT achievements based on your DeFi activities, trading milestones, and protocol interactions",
      details: ["NFT Badges", "Rarity System", "Progress Tracking", "Social Recognition"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Trading Profiles",
      description: "Create stunning shareable profiles, compare strategies with friends, and discover traders with similar patterns worldwide",
      details: ["Profile Customization", "Strategy Comparison", "Social Discovery", "Performance Tracking"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Spotify-Style Wrapped",
      description: "Get your personalized crypto year recap with beautiful animations, key highlights, and shareable moments from your journey",
      details: ["Annual Recaps", "Visual Stories", "Milestone Highlights", "Social Sharing"],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Insights",
      description: "Live dashboard with instant updates, market sentiment analysis, and personalized trading recommendations powered by your data",
      details: ["Live Updates", "Market Analysis", "Smart Alerts", "Custom Recommendations"],
      color: "from-red-500 to-rose-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Protocol Support",
      description: "Comprehensive analysis across 50+ DeFi protocols on Aptos, with detailed interaction history and protocol-specific insights",
      details: ["50+ Protocols", "Cross-Protocol Analysis", "Interaction History", "Protocol Rankings"],
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const personalities = [
    { 
      name: "DeFi Degen", 
      percentage: "34%", 
      color: "from-red-500 to-orange-500", 
      emoji: "🔥",
      description: "High-risk, high-reward traders who dive deep into experimental protocols"
    },
    { 
      name: "Diamond Hands", 
      percentage: "28%", 
      color: "from-blue-500 to-purple-500", 
      emoji: "💎",
      description: "Long-term holders who weather market storms with unwavering patience"
    },
    { 
      name: "Yield Farmer", 
      percentage: "19%", 
      color: "from-green-500 to-teal-500", 
      emoji: "🌾",
      description: "Strategic optimizers who maximize returns through careful yield farming"
    },
    { 
      name: "NFT Collector", 
      percentage: "19%", 
      color: "from-purple-500 to-pink-500", 
      emoji: "🎨",
      description: "Art and collectible enthusiasts building unique digital portfolios"
    }
  ];

  const achievements = [
    { 
      title: "Genesis Explorer", 
      desc: "Made your first transaction on Aptos", 
      rarity: "Common", 
      users: "12.3k",
      icon: "🚀"
    },
    { 
      title: "Diamond Hands Master", 
      desc: "Held positions for 6+ months", 
      rarity: "Rare", 
      users: "2.1k",
      icon: "💎"
    },
    { 
      title: "Whale Status", 
      desc: "Portfolio value exceeded $50k", 
      rarity: "Legendary", 
      users: "247",
      icon: "🐋"
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "2.3M", label: "Transactions Analyzed", icon: <BarChart3 className="w-6 h-6" /> },
    { number: "150+", label: "Achievement Types", icon: <Award className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wallet className="w-10 h-10 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  WalletPersona
                </span>
                <div className="text-xs text-gray-400 -mt-1">Discover Your Crypto DNA</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="relative group">
                <span className="hover:text-purple-400 transition-colors">Features</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="#personalities" className="relative group">
                <span className="hover:text-purple-400 transition-colors">Personalities</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="#achievements" className="relative group">
                <span className="hover:text-purple-400 transition-colors">Achievements</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <WalletConnectButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a href="#features" className="block px-4 py-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors">
                Features
              </a>
              <a href="#personalities" className="block px-4 py-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors">
                Personalities
              </a>
              <a href="#achievements" className="block px-4 py-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors">
                Achievements
              </a>
              <WalletConnectButton className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 rounded-lg font-semibold mt-4" />
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delay"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Enhanced Headlines */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">AI-Powered Crypto Analytics</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="block">Discover Your</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Crypto DNA
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
                Transform your wallet into a personalized crypto identity with AI-powered insights, 
                dynamic achievements, and stunning visual analytics
              </p>
              
              <p className="text-lg text-purple-200 mb-12 max-w-2xl mx-auto">
                Join 50,000+ users who discovered their unique trading personality and unlocked exclusive on-chain achievements
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              {isConnected ? (
                <Link 
                  href="/dashboard"
                  className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-3"
                >
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  Enter Dashboard
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </Link>
              ) : (
                <WalletConnectButton className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Discover My Crypto DNA
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </WalletConnectButton>
              )}
              
              <button className="group border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 flex items-center gap-3 backdrop-blur-sm">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="text-purple-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Demo Preview */}
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-black/40 rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-400 font-medium">Live Dashboard</span>
                    </div>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-4">DeFi Degen</h3>
                    <div className="space-y-2 text-left">
                      <p className="text-gray-300 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> 1,247 transactions
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> $89,342 volume
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-2xl p-8 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-gray-400 font-medium">Achievements</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-6">12 Badges Earned</h3>
                    <div className="flex gap-3 justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg group-hover:rotate-12 transition-transform">🏆</div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-lg group-hover:rotate-12 transition-transform">💎</div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-lg group-hover:rotate-12 transition-transform">🌾</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-2xl p-8 border border-white/10 hover:border-green-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-400 font-medium">AI Insights</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Risk Profile</h3>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-3 rounded-full animate-pulse" style={{width: '73%'}}></div>
                      </div>
                      <p className="text-sm text-gray-300">Moderate Risk (73/100)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="section-features" className="py-32 bg-black/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">Powerful Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Built for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Every Trader</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From crypto newcomers to DeFi veterans, discover insights that transform how you understand your blockchain journey
            </p>
          </div>
          
          {/* Interactive Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/80 p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm ${
                  isVisible['section-features'] ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Spotlight */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-purple-500/20 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">Experience the Future of Wallet Analytics</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Our AI analyzes over 100 data points from your transaction history to create a unique crypto personality profile
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <span className="text-lg font-semibold">AI-Powered</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  <span className="text-lg font-semibold">Privacy-First</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <span className="text-lg font-semibold">Real-Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Personalities Section */}
      <section id="section-personalities" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Crypto Personalities</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Trading Tribe</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover which of the distinct trader personalities matches your on-chain behavior and join your community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              {personalities.map((personality, index) => (
                <div 
                  key={index} 
                  className="group bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {personality.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold">{personality.name}</span>
                        <span className="text-purple-400 font-semibold text-lg">{personality.percentage}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{personality.description}</p>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r ${personality.color} h-3 rounded-full transition-all duration-1000 group-hover:animate-pulse`} 
                          style={{width: personality.percentage}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-10 border border-white/10 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-8 text-center">Live Community Stats</h3>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:animate-pulse">50,847</div>
                  <div className="text-gray-300 font-medium">Active Traders</div>
                </div>
                <div className="group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-pink-400 mb-2 group-hover:animate-pulse">247k</div>
                  <div className="text-gray-300 font-medium">Badges Earned</div>
                </div>
                <div className="group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-green-400 mb-2 group-hover:animate-pulse">$2.8B</div>
                  <div className="text-gray-300 font-medium">Volume Tracked</div>
                </div>
                <div className="group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:animate-pulse">+1,247</div>
                  <div className="text-gray-300 font-medium">Joined Today</div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-gray-300 mb-4">Which personality will you discover?</p>
                <WalletConnectButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Find Out Now
                </WalletConnectButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Achievements Section */}
      <section id="section-achievements" className="py-32 bg-black/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-3 mb-8">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">Achievement System</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Unlock <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Epic Rewards</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Earn exclusive NFT badges, unlock rare achievements, and showcase your DeFi mastery with our gamified reward system
            </p>
          </div>

          {/* Achievement Showcase */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/80 p-8 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm ${
                  isVisible['section-achievements'] ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {achievement.icon}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      achievement.rarity === 'Common' ? 'bg-gray-500/20 text-gray-300' :
                      achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' :
                      achievement.rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {achievement.desc}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{achievement.users} earned</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center border border-yellow-500/30 group-hover:border-yellow-400/50 transition-colors">
                      <Lock className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Progress Preview */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl p-12 border border-yellow-500/20 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Your Achievement Journey</h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Every transaction tells a story. Every milestone deserves recognition. Track your progress and compete with friends in our comprehensive achievement system.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300">Real-time achievement tracking</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Exclusive NFT badges</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Social leaderboards</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-black/40 rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold">Achievement Progress</h4>
                    <span className="text-yellow-400 font-bold">73%</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">First Steps</span>
                        <span className="text-green-400 text-sm">✓ Complete</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Volume Trader</span>
                        <span className="text-blue-400 text-sm">87/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Diamond Hands</span>
                        <span className="text-orange-400 text-sm">45%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full w-2/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-medium">How It Works</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Simple</span> Yet Powerful
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get started in minutes and unlock insights that would take hours of manual analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Securely connect your Aptos wallet with our privacy-first approach. We only read public transaction data.",
                icon: <Wallet className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our advanced AI analyzes your transaction patterns, protocol usage, and trading behavior across 100+ data points.",
                icon: <Brain className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Get Your Profile",
                description: "Receive your personalized crypto DNA with insights, achievements, and shareable social media content.",
                icon: <Star className="w-8 h-8" />,
                color: "from-yellow-500 to-orange-500"
              }
            ].map((step, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${step.color} p-6 group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Demo */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-3xl p-12 border border-white/10 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">See It In Action</h3>
              <p className="text-xl text-gray-300">Watch how WalletPersona transforms raw blockchain data into meaningful insights</p>
            </div>
            
            <div className="relative">
              <div className="bg-black/60 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">WalletPersona Analysis Terminal</div>
                </div>
                
                <div className="space-y-3 font-mono text-sm">
                  <div className="text-green-400">$ Analyzing wallet: 0x1a2b...4e5f</div>
                  <div className="text-blue-400">→ Scanning 1,247 transactions...</div>
                  <div className="text-yellow-400">→ Identifying patterns across 23 protocols...</div>
                  <div className="text-purple-400">→ Calculating risk profile...</div>
                  <div className="text-cyan-400">→ Generating personality insights...</div>
                  <div className="text-green-400">✓ Analysis complete! You're a DeFi Degen 🔥</div>
                  <div className="text-white">→ View your complete crypto DNA profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Community Love</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              What <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Traders Say</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied users who discovered their crypto identity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "DeFi Strategist",
                avatar: "🦸‍♂️",
                rating: 5,
                text: "WalletPersona showed me patterns in my trading I never noticed. The AI insights helped me optimize my DeFi strategy and reduce risk by 40%."
              },
              {
                name: "Sarah Williams", 
                role: "Crypto Influencer",
                avatar: "👩‍💼",
                rating: 5,
                text: "The social sharing features are amazing! My followers love seeing my crypto personality updates. It's become part of my weekly content strategy."
              },
              {
                name: "Marcus Johnson",
                role: "Yield Farmer",
                avatar: "🌾",
                rating: 5,
                text: "Finally, a platform that understands my farming strategies! The achievement system keeps me motivated, and the analytics are incredibly detailed."
              }
            ].map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/80 p-8 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Ready to Discover Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Crypto DNA?
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
            Join 50,000+ traders who unlocked their crypto personality
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {isConnected ? (
              <Link 
                href="/dashboard"
                className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 px-12 py-6 rounded-full font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-4"
              >
                <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                Enter Your Dashboard
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Link>
            ) : (
              <WalletConnectButton className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 px-12 py-6 rounded-full font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-4">
                <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                Start Your Journey
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </WalletConnectButton>
            )}
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-sm text-gray-400">100% Secure</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">Instant Analysis</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Wallet className="w-10 h-10 text-purple-400" />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    WalletPersona
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">Discover Your Crypto DNA</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The most advanced AI-powered crypto personality platform. Discover your trading patterns, unlock achievements, and connect with your crypto community.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center hover:bg-purple-500/30 transition-colors cursor-pointer">
                  <span className="text-purple-400 font-bold">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center hover:bg-purple-500/30 transition-colors cursor-pointer">
                  <span className="text-purple-400">📱</span>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center hover:bg-purple-500/30 transition-colors cursor-pointer">
                  <span className="text-purple-400">💬</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <div className="space-y-4">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#personalities" className="block text-gray-400 hover:text-white transition-colors">Personalities</a>
                <a href="#achievements" className="block text-gray-400 hover:text-white transition-colors">Achievements</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <div className="space-y-4">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 WalletPersona. Built on Aptos blockchain. All rights reserved.
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.8);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default EnhancedModernLanding;
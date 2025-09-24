"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, Award, BarChart3, Share2, Shield, ArrowRight, Menu, X, Play, CheckCircle } from 'lucide-react';
import { WalletConnectButton } from '../components/WalletConnect';
import { useWalletContext } from '../contexts/WalletContext';

const ModernWeb3Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useWalletContext();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Beautiful Analytics",
      description: "Transform your transaction history into stunning visual insights and discover hidden patterns"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Achievement System",
      description: "Unlock unique badges based on your trading behavior and DeFi interactions"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Profiles",
      description: "Create shareable profiles and compare your crypto journey with friends"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trading Insights",
      description: "Get personalized insights about your trading patterns and risk management"
    }
  ];

  const personalities = [
    { name: "DeFi Degen", percentage: "34%", color: "from-red-500 to-orange-500", emoji: "🔥" },
    { name: "Diamond Hands", percentage: "28%", color: "from-blue-500 to-purple-500", emoji: "💎" },
    { name: "Yield Farmer", percentage: "19%", color: "from-green-500 to-teal-500", emoji: "🌾" },
    { name: "NFT Collector", percentage: "19%", color: "from-purple-500 to-pink-500", emoji: "🎨" }
  ];

  const achievements = [
    { title: "First Steps", desc: "Made your first transaction", rarity: "Common", users: "12.3k" },
    { title: "Diamond Hands", desc: "Held for 6+ months", rarity: "Rare", users: "2.1k" },
    { title: "Whale Alert", desc: "Single tx > $10k", rarity: "Legendary", users: "247" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wallet className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Aporto
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#community" className="hover:text-purple-400 transition-colors">Community</a>
              <a href="#achievements" className="hover:text-purple-400 transition-colors">Achievements</a>
              <WalletConnectButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 hover:text-purple-400 transition-colors">Features</a>
              <a href="#community" className="block px-3 py-2 hover:text-purple-400 transition-colors">Community</a>
              <a href="#achievements" className="block px-3 py-2 hover:text-purple-400 transition-colors">Achievements</a>
              <WalletConnectButton className="w-full text-left bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-lg font-medium mt-2" />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Crypto Personality
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your wallet data into beautiful insights, unlock achievements, 
              and share your unique DeFi journey with the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isConnected ? (
                <Link 
                  href="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              ) : (
                <WalletConnectButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </WalletConnectButton>
              )}
              <button className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" /> View Demo
              </button>
            </div>

            {/* Demo Preview */}
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-400">Live Dashboard</span>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-2">DeFi Degen 🔥</h3>
                    <p className="text-gray-300">234 transactions</p>
                    <p className="text-gray-300">$12,847 volume</p>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-gray-400">Achievements</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">7 Badges Earned</h3>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs">🏆</div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs">💎</div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs">🌾</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-400">Insights</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Risk Score</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                    <p className="text-sm text-gray-400">Moderate Risk (73/100)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for <span className="text-purple-400">Every Trader</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From beginners to DeFi veterans, discover insights that matter to your crypto journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Join the <span className="text-purple-400">Community</span>
            </h2>
            <p className="text-xl text-gray-300">
              See how you compare with traders worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Popular Trading Personalities</h3>
              <div className="space-y-4">
                {personalities.map((personality, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-white/10">
                    <div className="text-2xl">{personality.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{personality.name}</span>
                        <span className="text-purple-400">{personality.percentage}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`bg-gradient-to-r ${personality.color} h-2 rounded-full`} 
                             style={{width: personality.percentage}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-center">Live Community Stats</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400">2,847</div>
                  <div className="text-gray-300">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400">47k</div>
                  <div className="text-gray-300">Badges Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">$12.3M</div>
                  <div className="text-gray-300">Volume Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">156</div>
                  <div className="text-gray-300">New Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Unlock <span className="text-purple-400">Achievements</span>
            </h2>
            <p className="text-xl text-gray-300">
              Earn unique badges based on your trading behavior and DeFi journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-white/10 text-center group hover:border-yellow-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  🏆
                </div>
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-gray-300 mb-4">{achievement.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    achievement.rarity === 'Common' ? 'bg-gray-500/20 text-gray-300' :
                    achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {achievement.rarity}
                  </span>
                  <span className="text-sm text-gray-400">{achievement.users} earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Built for Security & Privacy</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span>Only reads public blockchain data</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span>No access to private keys</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span>You control what to share</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wallet className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Aporto
                </span>
              </div>
              <p className="text-gray-400">
                Discover your crypto personality and unlock achievements based on your unique trading journey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Achievements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Aporto. Built with ❤️ for the Aptos community.</p>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default ModernWeb3Landing;
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { aptosProfileService, WalletProfile, ProfileData, Achievement } from '../services/aptosProfileService';
import { realWalletAnalyticsService, RealWalletAnalytics } from '../services/realWalletAnalytics';

export interface UseProfileReturn {
  profile: WalletProfile | null;
  isLoading: boolean;
  error: string | null;
  profileExists: boolean;
  createProfile: () => Promise<void>;
  updateProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isCreatingProfile: boolean;
  isUpdatingProfile: boolean;
}

export function useProfile(): UseProfileReturn {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!account?.address || !connected) {
      setProfile(null);
      setProfileExists(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const address = account.address.toString();
      
      // Check if profile exists
      const exists = await aptosProfileService.profileExists(address);
      setProfileExists(exists);

      if (exists) {
        const profileData = await aptosProfileService.getProfile(address);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
      setProfileExists(false);
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, connected]);

  // Create new profile
  const createProfile = useCallback(async () => {
    if (!account?.address || !connected) {
      setError('Wallet not connected');
      return;
    }

    setIsCreatingProfile(true);
    setError(null);

    try {
      const address = account.address.toString();
      
      // Analyze wallet to get comprehensive stats
      const analytics = await realWalletAnalyticsService.getWalletAnalytics(address);
      const stats = {
        personalityType: analytics.calculatedPersonality.type,
        totalTransactions: analytics.totalTransactions,
        portfolioValue: analytics.balance.apt,
        totalVolume: analytics.totalVolumeTransacted,
        activeProtocols: analytics.uniqueModulesInteracted
      };
      
      // Create profile transaction
      const payload = {
        type: "entry_function_payload",
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS || "0x42"}::profile::create_profile`,
        arguments: [
          stats.personalityType,
          stats.totalTransactions,
          Math.floor(stats.portfolioValue),
          Math.floor(stats.totalVolume),
          stats.activeProtocols,
        ],
      } as any;

      const response = await signAndSubmitTransaction(payload);
      console.log('Profile created successfully:', response);

      // Refresh profile data
      setTimeout(() => {
        fetchProfile();
      }, 2000); // Wait a bit for blockchain to update

    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsCreatingProfile(false);
    }
  }, [account?.address, connected, signAndSubmitTransaction, fetchProfile]);

  // Update existing profile
  const updateProfile = useCallback(async () => {
    if (!account?.address || !connected || !profileExists) {
      setError('Profile does not exist or wallet not connected');
      return;
    }

    setIsUpdatingProfile(true);
    setError(null);

    try {
      const address = account.address.toString();
      
      // Analyze wallet to get updated comprehensive stats
      const analytics = await realWalletAnalyticsService.getWalletAnalytics(address);
      const stats = {
        totalTransactions: analytics.totalTransactions,
        portfolioValue: analytics.balance.apt,
        totalVolume: analytics.totalVolumeTransacted,
        activeProtocols: analytics.uniqueModulesInteracted
      };
      
      // Update profile transaction
      const payload = {
        type: "entry_function_payload",
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS || "0x42"}::profile::update_profile`,
        arguments: [
          stats.totalTransactions,
          Math.floor(stats.portfolioValue),
          Math.floor(stats.totalVolume),
          stats.activeProtocols,
        ],
      } as any;

      const response = await signAndSubmitTransaction(payload);
      console.log('Profile updated successfully:', response);

      // Refresh profile data
      setTimeout(() => {
        fetchProfile();
      }, 2000); // Wait a bit for blockchain to update

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  }, [account?.address, connected, profileExists, signAndSubmitTransaction, fetchProfile]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Auto-fetch profile when wallet connects
  useEffect(() => {
    if (connected && account?.address) {
      fetchProfile();
    } else {
      setProfile(null);
      setProfileExists(false);
      setError(null);
    }
  }, [connected, account?.address, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    profileExists,
    createProfile,
    updateProfile,
    refreshProfile,
    isCreatingProfile,
    isUpdatingProfile,
  };
}

// Hook for getting community stats
export function useCommunityStats() {
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunityStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const total = await aptosProfileService.getTotalProfiles();
      setTotalProfiles(total);
    } catch (err) {
      console.error('Error fetching community stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch community stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityStats();
  }, [fetchCommunityStats]);

  return {
    totalProfiles,
    isLoading,
    error,
    refreshStats: fetchCommunityStats,
  };
}

// Hook for wallet analysis without creating profile
export function useWalletAnalysis() {
  const { account, connected } = useWallet();
  const [analysis, setAnalysis] = useState<RealWalletAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWallet = useCallback(async () => {
    if (!account?.address || !connected) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const address = account.address.toString();
      const analytics = await realWalletAnalyticsService.getWalletAnalytics(address);
      setAnalysis(analytics);
    } catch (err) {
      console.error('Error analyzing wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze wallet');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [account?.address, connected]);

  useEffect(() => {
    if (connected && account?.address) {
      analyzeWallet();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [connected, account?.address, analyzeWallet]);

  return {
    analysis,
    isAnalyzing,
    error,
    refreshAnalysis: analyzeWallet,
  };
}
import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from "aptos";

// Smart contract configuration
export const SMART_CONTRACT_CONFIG = {
  moduleAddress: process.env.NEXT_PUBLIC_MODULE_ADDRESS || "0x42", // Will be updated after deployment
  moduleName: "profile",
  network: process.env.NEXT_PUBLIC_APTOS_NETWORK || "testnet"
};

// Aptos client setup
const getAptosClient = () => {
  const network = SMART_CONTRACT_CONFIG.network;
  const nodeUrl = network === "mainnet" 
    ? "https://fullnode.mainnet.aptoslabs.com/v1"
    : "https://fullnode.testnet.aptoslabs.com/v1";
  
  return new AptosClient(nodeUrl);
};

// Personality type mappings
export const PERSONALITY_TYPES = {
  1: {
    name: "DeFi Degen",
    emoji: "🔥",
    description: "Bold, experimental, always hunting for yield",
    traits: ["Risk-taker", "Early Adopter", "Yield Hunter", "Protocol Explorer"]
  },
  2: {
    name: "Diamond Hands", 
    emoji: "💎",
    description: "Patient, strong conviction, long-term focused",
    traits: ["HODLer", "Patient", "Strong Conviction", "Long-term Vision"]
  },
  3: {
    name: "Yield Farmer",
    emoji: "🌾", 
    description: "Strategic, yield-focused, protocol optimizer",
    traits: ["Strategic", "Yield Hunter", "Protocol Optimizer", "DeFi Native"]
  },
  4: {
    name: "NFT Collector",
    emoji: "🎨",
    description: "Creative, trend-aware, community-driven", 
    traits: ["Creative", "Trend Setter", "Community Focused", "Art Enthusiast"]
  },
  5: {
    name: "Cautious Trader",
    emoji: "🛡️",
    description: "Conservative, risk-averse, steady growth",
    traits: ["Conservative", "Risk Averse", "Steady", "Analytical"]
  },
  6: {
    name: "Whale",
    emoji: "🐋",
    description: "High-volume trader, market mover, influential",
    traits: ["High Volume", "Market Mover", "Influential", "Deep Pockets"]
  }
};

// Achievement type mappings
export const ACHIEVEMENT_TYPES = {
  1: { name: "First Steps", emoji: "👶", rarity: "Common" },
  2: { name: "Century Club", emoji: "💯", rarity: "Uncommon" },
  3: { name: "DeFi Explorer", emoji: "🗺️", rarity: "Rare" },
  4: { name: "Whale Status", emoji: "🐋", rarity: "Epic" },
  5: { name: "Diamond Hands", emoji: "💎", rarity: "Legendary" },
  6: { name: "Yield Master", emoji: "🌾", rarity: "Legendary" }
};

export interface ProfileData {
  personality_type: number;
  personality_emoji: string;
  personality_description: string;
  rarity_percentage: number;
  traits: string[];
  total_transactions: number;
  portfolio_value: number;
  total_volume: number;
  active_protocols: number;
  win_rate: number;
  risk_score: number;
  diversification_score: number;
  created_at: number;
  updated_at: number;
}

export interface Achievement {
  achievement_id: number;
  name: string;
  description: string;
  rarity: string;
  emoji: string;
  earned: boolean;
  progress: number;
  earned_at: number;
}

export interface WalletProfile {
  profile: ProfileData;
  achievements: Achievement[];
  total_achievements_earned: number;
}

export class AptosProfileService {
  private client: AptosClient;

  constructor() {
    this.client = getAptosClient();
  }

  // Check if a profile exists for the given address
  async profileExists(address: string): Promise<boolean> {
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${SMART_CONTRACT_CONFIG.moduleAddress}::${SMART_CONTRACT_CONFIG.moduleName}::WalletProfile`
      );
      return !!resource;
    } catch (error) {
      return false;
    }
  }

  // Get profile data for a user
  async getProfile(address: string): Promise<WalletProfile | null> {
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${SMART_CONTRACT_CONFIG.moduleAddress}::${SMART_CONTRACT_CONFIG.moduleName}::WalletProfile`
      );

      if (!resource) {
        return null;
      }

      const data = resource.data as any;
      
      return {
        profile: {
          personality_type: parseInt(data.profile.personality_type),
          personality_emoji: data.profile.personality_emoji,
          personality_description: data.profile.personality_description,
          rarity_percentage: parseInt(data.profile.rarity_percentage),
          traits: data.profile.traits,
          total_transactions: parseInt(data.profile.total_transactions),
          portfolio_value: parseInt(data.profile.portfolio_value),
          total_volume: parseInt(data.profile.total_volume),
          active_protocols: parseInt(data.profile.active_protocols),
          win_rate: parseInt(data.profile.win_rate),
          risk_score: parseInt(data.profile.risk_score),
          diversification_score: parseInt(data.profile.diversification_score),
          created_at: parseInt(data.profile.created_at),
          updated_at: parseInt(data.profile.updated_at),
        },
        achievements: data.achievements.map((achievement: any) => ({
          achievement_id: parseInt(achievement.achievement_id),
          name: achievement.name,
          description: achievement.description,
          rarity: achievement.rarity,
          emoji: achievement.emoji,
          earned: achievement.earned,
          progress: parseInt(achievement.progress),
          earned_at: parseInt(achievement.earned_at),
        })),
        total_achievements_earned: parseInt(data.total_achievements_earned),
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  // Create a new profile
  async createProfile(
    account: AptosAccount,
    personalityType: number,
    totalTransactions: number,
    portfolioValue: number,
    totalVolume: number,
    activeProtocols: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${SMART_CONTRACT_CONFIG.moduleAddress}::${SMART_CONTRACT_CONFIG.moduleName}::create_profile`,
      type_arguments: [],
      arguments: [
        personalityType.toString(),
        totalTransactions.toString(),
        Math.floor(portfolioValue).toString(),
        Math.floor(totalVolume).toString(),
        activeProtocols.toString(),
      ],
    };

    try {
      const txnRequest = await this.client.generateTransaction(account.address(), payload);
      const signedTxn = await this.client.signTransaction(account, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      await this.client.waitForTransaction(transactionRes.hash);
      
      return transactionRes.hash;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  }

  // Update an existing profile
  async updateProfile(
    account: AptosAccount,
    totalTransactions: number,
    portfolioValue: number,
    totalVolume: number,
    activeProtocols: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${SMART_CONTRACT_CONFIG.moduleAddress}::${SMART_CONTRACT_CONFIG.moduleName}::update_profile`,
      type_arguments: [],
      arguments: [
        totalTransactions.toString(),
        Math.floor(portfolioValue).toString(),
        Math.floor(totalVolume).toString(),
        activeProtocols.toString(),
      ],
    };

    try {
      const txnRequest = await this.client.generateTransaction(account.address(), payload);
      const signedTxn = await this.client.signTransaction(account, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      await this.client.waitForTransaction(transactionRes.hash);
      
      return transactionRes.hash;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Get total profiles count
  async getTotalProfiles(): Promise<number> {
    try {
      const resource = await this.client.getAccountResource(
        SMART_CONTRACT_CONFIG.moduleAddress,
        `${SMART_CONTRACT_CONFIG.moduleAddress}::${SMART_CONTRACT_CONFIG.moduleName}::ProfileRegistry`
      );

      const data = resource.data as any;
      return parseInt(data.total_profiles);
    } catch (error) {
      console.error("Error fetching total profiles:", error);
      return 0;
    }
  }

  // Analyze wallet transactions to calculate stats
  async analyzeWalletTransactions(address: string): Promise<{
    totalTransactions: number;
    portfolioValue: number;
    totalVolume: number;
    activeProtocols: number;
    personalityType: number;
  }> {
    try {
      // Get account transactions
      const transactions = await this.client.getAccountTransactions(address, {
        limit: 1000
      });

      // Get account resources for current balance
      const resources = await this.client.getAccountResources(address);
      
      // Calculate basic stats from transaction history
      const totalTransactions = transactions.length;
      
      // Calculate total volume from successful transactions
      let totalVolume = 0;
      const protocolSet = new Set<string>();
      
      transactions.forEach((txn: any) => {
        if (txn.success) {
          // Extract volume from gas_used and events
          if (txn.gas_used) {
            totalVolume += parseInt(txn.gas_used) * 0.0001; // Rough estimation
          }
          
          // Track unique modules interacted with
          if (txn.payload && txn.payload.function) {
            const moduleAddress = txn.payload.function.split('::')[0];
            protocolSet.add(moduleAddress);
          }
        }
      });

      // Get APT balance for portfolio value
      let portfolioValue = 0;
      const aptResource = resources.find((r: any) => 
        r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      
      if (aptResource) {
        const balance = parseInt((aptResource.data as any).coin.value);
        portfolioValue = balance / 100000000; // Convert from octas to APT
      }

      const activeProtocols = protocolSet.size;
      
      // Calculate personality based on activity patterns
      const personalityType = this.calculatePersonalityType(
        totalTransactions,
        portfolioValue,
        totalVolume,
        activeProtocols
      );

      return {
        totalTransactions,
        portfolioValue,
        totalVolume,
        activeProtocols,
        personalityType
      };
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      // Return default values if analysis fails
      return {
        totalTransactions: 1,
        portfolioValue: 0,
        totalVolume: 0,
        activeProtocols: 1,
        personalityType: 5 // Cautious Trader as default
      };
    }
  }

  // Calculate personality type based on wallet activity
  private calculatePersonalityType(
    totalTransactions: number,
    portfolioValue: number,
    totalVolume: number,
    activeProtocols: number
  ): number {
    // Whale detection (high portfolio value)
    if (portfolioValue > 500) { // 500+ APT
      return 6; // WHALE
    }

    // High transaction activity with many protocols = DeFi Degen
    if (totalTransactions > 100 && activeProtocols > 10) {
      return 1; // DEFI_DEGEN
    }

    // High protocol usage with moderate volume = Yield Farmer
    if (activeProtocols > 8 && totalVolume > 100) {
      return 3; // YIELD_FARMER
    }

    // Low transaction frequency but decent balance = Diamond Hands
    if (totalTransactions < 50 && portfolioValue > 10) {
      return 2; // DIAMOND_HANDS
    }

    // NFT-related activity detection (simplified)
    if (activeProtocols > 5 && totalTransactions > 20) {
      return 4; // NFT_COLLECTOR
    }

    // Default to cautious trader
    return 5; // CAUTIOUS_TRADER
  }

  // Get account balance in APT
  async getAccountBalance(address: string): Promise<number> {
    try {
      const resources = await this.client.getAccountResources(address);
      const aptResource = resources.find((r: any) => 
        r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      
      if (aptResource) {
        const balance = parseInt((aptResource.data as any).coin.value);
        return balance / 100000000; // Convert from octas to APT
      }
      
      return 0;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  }
}

// Export singleton instance
export const aptosProfileService = new AptosProfileService();
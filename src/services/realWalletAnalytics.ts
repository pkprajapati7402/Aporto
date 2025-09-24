import { AptosClient } from "aptos";

export interface RealWalletAnalytics {
  // Basic wallet info
  address: string;
  balance: {
    apt: number;
    usdValue: number;
  };
  
  // Transaction analytics
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalGasUsed: number;
  averageGasPerTransaction: number;
  
  // Activity patterns
  transactionsLast7Days: number;
  transactionsLast30Days: number;
  mostActiveDay: string;
  mostActiveHour: number;
  
  // Protocol interaction
  uniqueModulesInteracted: number;
  topModules: Array<{
    module: string;
    interactions: number;
    name: string;
  }>;
  
  // Financial metrics
  totalVolumeTransacted: number;
  estimatedPortfolioValue: number;
  largestSingleTransaction: number;
  averageTransactionValue: number;
  
  // DeFi specific
  swapCount: number;
  liquidityProvisions: number;
  stakingActivities: number;
  nftTransactions: number;
  
  // Risk assessment
  riskScore: number; // 0-100
  diversificationScore: number; // 0-100
  activityScore: number; // 0-100
  
  // Time analysis
  accountAge: number; // in days
  lastActivity: Date;
  activityTrend: 'increasing' | 'decreasing' | 'stable';
  
  // Personality calculation
  calculatedPersonality: {
    type: number;
    confidence: number; // 0-100
    reasons: string[];
  };
}

export interface RecentTransaction {
  hash: string;
  timestamp: Date;
  type: 'transfer' | 'swap' | 'stake' | 'liquidity' | 'nft' | 'other';
  status: 'success' | 'failed';
  gasUsed: number;
  module: string;
  amount?: number;
  token?: string;
  description: string;
}

const APT_TO_USD_RATE = 8.5; // This should be fetched from an API in production

export class RealWalletAnalyticsService {
  private client: AptosClient;
  private cache: Map<string, { data: RealWalletAnalytics; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const network = process.env.NEXT_PUBLIC_APTOS_NETWORK || "testnet";
    const nodeUrl = network === "mainnet" 
      ? "https://fullnode.mainnet.aptoslabs.com/v1"
      : "https://fullnode.testnet.aptoslabs.com/v1";
    
    this.client = new AptosClient(nodeUrl);
  }

  async getWalletAnalytics(address: string): Promise<RealWalletAnalytics> {
    // Check cache first
    const cached = this.cache.get(address);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const analytics = await this.performAnalysis(address);
      
      // Cache the result
      this.cache.set(address, {
        data: analytics,
        timestamp: Date.now()
      });
      
      return analytics;
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      throw error;
    }
  }

  private async performAnalysis(address: string): Promise<RealWalletAnalytics> {
    // Fetch account data in parallel
    const [resources, transactions, accountInfo] = await Promise.all([
      this.client.getAccountResources(address).catch(() => []),
      this.client.getAccountTransactions(address, { limit: 1000 }).catch(() => []),
      this.client.getAccount(address).catch(() => null)
    ]);

    // Calculate basic balance
    const balance = await this.calculateBalance(resources);
    
    // Analyze transactions
    const transactionAnalysis = this.analyzeTransactions(transactions);
    
    // Calculate activity patterns
    const activityPatterns = this.calculateActivityPatterns(transactions);
    
    // Analyze protocol interactions
    const protocolAnalysis = this.analyzeProtocolInteractions(transactions);
    
    // Calculate financial metrics
    const financialMetrics = this.calculateFinancialMetrics(transactions, balance.apt);
    
    // Calculate DeFi specific metrics
    const defiMetrics = this.calculateDeFiMetrics(transactions);
    
    // Calculate risk scores
    const riskAnalysis = this.calculateRiskScores(transactions, balance.apt, protocolAnalysis);
    
    // Calculate account age
    const accountAge = this.calculateAccountAge(accountInfo, transactions);
    
    // Calculate personality
    const personality = this.calculatePersonality({
      ...transactionAnalysis,
      ...activityPatterns,
      ...protocolAnalysis,
      ...financialMetrics,
      ...defiMetrics,
      balance: balance.apt
    });

    return {
      address,
      balance: {
        apt: balance.apt,
        usdValue: balance.apt * APT_TO_USD_RATE
      },
      ...transactionAnalysis,
      ...activityPatterns,
      ...protocolAnalysis,
      ...financialMetrics,
      ...defiMetrics,
      ...riskAnalysis,
      accountAge,
      lastActivity: transactions.length > 0 ? new Date((transactions[0] as any).timestamp) : new Date(),
      activityTrend: this.calculateActivityTrend(transactions),
      calculatedPersonality: personality
    };
  }

  private async calculateBalance(resources: any[]): Promise<{ apt: number }> {
    const aptResource = resources.find((r: any) => 
      r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
    );
    
    if (aptResource) {
      const balance = parseInt((aptResource.data as any).coin.value);
      return { apt: balance / 100000000 }; // Convert from octas to APT
    }
    
    return { apt: 0 };
  }

  private analyzeTransactions(transactions: any[]) {
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(tx => tx.success === true).length;
    const failedTransactions = totalTransactions - successfulTransactions;
    
    const totalGasUsed = transactions.reduce((sum, tx) => {
      return sum + (parseInt((tx as any).gas_used || '0'));
    }, 0);
    
    const averageGasPerTransaction = totalTransactions > 0 ? totalGasUsed / totalTransactions : 0;

    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalGasUsed,
      averageGasPerTransaction
    };
  }

  private calculateActivityPatterns(transactions: any[]) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const transactionsLast7Days = transactions.filter(tx => {
      const txData = tx as any;
      return txData.timestamp && new Date(txData.timestamp) > sevenDaysAgo;
    }).length;

    const transactionsLast30Days = transactions.filter(tx => {
      const txData = tx as any;
      return txData.timestamp && new Date(txData.timestamp) > thirtyDaysAgo;
    }).length;

    // Calculate most active day and hour
    const dayCount: { [key: string]: number } = {};
    const hourCount: { [key: number]: number } = {};

    transactions.forEach(tx => {
      const txData = tx as any;
      if (txData.timestamp) {
        const date = new Date(txData.timestamp);
        const dayKey = date.toDateString();
        const hour = date.getHours();

        dayCount[dayKey] = (dayCount[dayKey] || 0) + 1;
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    });

    const mostActiveDay = Object.entries(dayCount).reduce((max, [day, count]) => 
      count > (dayCount[max] || 0) ? day : max, Object.keys(dayCount)[0] || 'No activity'
    );

    const mostActiveHour = Object.entries(hourCount).reduce((max, [hour, count]) => 
      count > (hourCount[max] || 0) ? parseInt(hour) : max, 0
    );

    return {
      transactionsLast7Days,
      transactionsLast30Days,
      mostActiveDay,
      mostActiveHour
    };
  }

  private analyzeProtocolInteractions(transactions: any[]) {
    const moduleInteractions: { [key: string]: number } = {};

    transactions.forEach(tx => {
      if (tx.payload && tx.payload.function) {
        const moduleAddress = tx.payload.function.split('::')[0];
        moduleInteractions[moduleAddress] = (moduleInteractions[moduleAddress] || 0) + 1;
      }
    });

    const uniqueModulesInteracted = Object.keys(moduleInteractions).length;
    
    const topModules = Object.entries(moduleInteractions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([module, interactions]) => ({
        module,
        interactions,
        name: this.getModuleName(module)
      }));

    return {
      uniqueModulesInteracted,
      topModules
    };
  }

  private calculateFinancialMetrics(transactions: any[], currentBalance: number) {
    let totalVolumeTransacted = 0;
    let largestSingleTransaction = 0;
    
    transactions.forEach(tx => {
      // Estimate transaction value from gas used (rough approximation)
      const gasUsed = parseInt(tx.gas_used || '0');
      const estimatedValue = gasUsed * 0.0001; // Very rough estimation
      
      totalVolumeTransacted += estimatedValue;
      largestSingleTransaction = Math.max(largestSingleTransaction, estimatedValue);
    });

    const averageTransactionValue = transactions.length > 0 ? totalVolumeTransacted / transactions.length : 0;
    const estimatedPortfolioValue = currentBalance;

    return {
      totalVolumeTransacted,
      estimatedPortfolioValue,
      largestSingleTransaction,
      averageTransactionValue
    };
  }

  private calculateDeFiMetrics(transactions: any[]) {
    let swapCount = 0;
    let liquidityProvisions = 0;
    let stakingActivities = 0;
    let nftTransactions = 0;

    transactions.forEach(tx => {
      if (tx.payload && tx.payload.function) {
        const func = tx.payload.function.toLowerCase();
        
        if (func.includes('swap') || func.includes('exchange')) {
          swapCount++;
        } else if (func.includes('liquidity') || func.includes('pool')) {
          liquidityProvisions++;
        } else if (func.includes('stake') || func.includes('delegate')) {
          stakingActivities++;
        } else if (func.includes('nft') || func.includes('token')) {
          nftTransactions++;
        }
      }
    });

    return {
      swapCount,
      liquidityProvisions,
      stakingActivities,
      nftTransactions
    };
  }

  private calculateRiskScores(transactions: any[], balance: number, protocolAnalysis: any) {
    // Risk score based on various factors
    let riskScore = 50; // Start with medium risk

    // High transaction frequency increases risk
    if (transactions.length > 500) riskScore += 20;
    else if (transactions.length > 100) riskScore += 10;

    // Many protocols increase risk
    if (protocolAnalysis.uniqueModulesInteracted > 20) riskScore += 15;
    else if (protocolAnalysis.uniqueModulesInteracted > 10) riskScore += 10;

    // Failed transactions increase risk
    const failureRate = transactions.length > 0 ? 
      transactions.filter(tx => (tx as any).success !== true).length / transactions.length : 0;
    riskScore += failureRate * 30;

    // Diversification score (more protocols = better diversification)
    const diversificationScore = Math.min(100, protocolAnalysis.uniqueModulesInteracted * 5);

    // Activity score based on recent activity
    const recentTransactions = transactions.filter(tx => {
      const txData = tx as any;
      return txData.timestamp && new Date(txData.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }).length;
    const activityScore = Math.min(100, recentTransactions * 2);

    return {
      riskScore: Math.min(100, Math.max(0, riskScore)),
      diversificationScore,
      activityScore
    };
  }

  private calculateAccountAge(accountInfo: any, transactions: any[]): number {
    if (transactions.length === 0) return 0;
    
    // Get the oldest transaction
    const oldestTransaction = transactions[transactions.length - 1] as any;
    const creationDate = oldestTransaction?.timestamp ? new Date(oldestTransaction.timestamp) : new Date();
    const now = new Date();
    
    return Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculateActivityTrend(transactions: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (transactions.length < 10) return 'stable';

    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentActivity = transactions.filter(tx => {
      const txData = tx as any;
      return txData.timestamp && new Date(txData.timestamp) > fifteenDaysAgo;
    }).length;

    const olderActivity = transactions.filter(tx => {
      const txData = tx as any;
      if (!txData.timestamp) return false;
      const date = new Date(txData.timestamp);
      return date > thirtyDaysAgo && date <= fifteenDaysAgo;
    }).length;

    if (recentActivity > olderActivity * 1.2) return 'increasing';
    if (recentActivity < olderActivity * 0.8) return 'decreasing';
    return 'stable';
  }

  private calculatePersonality(data: any) {
    const reasons: string[] = [];
    let personalityType = 5; // Default to Cautious Trader
    let confidence = 50;

    // Whale detection (high balance)
    if (data.balance > 500) {
      personalityType = 6;
      confidence = 90;
      reasons.push('High portfolio value (500+ APT)');
      return { type: personalityType, confidence, reasons };
    }

    // DeFi Degen (high activity + many protocols)
    if (data.totalTransactions > 100 && data.uniqueModulesInteracted > 10) {
      personalityType = 1;
      confidence = 85;
      reasons.push(`High transaction count (${data.totalTransactions})`);
      reasons.push(`Many protocols used (${data.uniqueModulesInteracted})`);
      return { type: personalityType, confidence, reasons };
    }

    // Yield Farmer (high protocol usage + swaps/liquidity)
    if (data.uniqueModulesInteracted > 8 && (data.swapCount > 20 || data.liquidityProvisions > 5)) {
      personalityType = 3;
      confidence = 80;
      reasons.push('High protocol diversity');
      reasons.push('Active in DeFi protocols');
      return { type: personalityType, confidence, reasons };
    }

    // Diamond Hands (low frequency but decent balance)
    if (data.totalTransactions < 50 && data.balance > 10) {
      personalityType = 2;
      confidence = 75;
      reasons.push('Low transaction frequency');
      reasons.push('Holding significant balance');
      return { type: personalityType, confidence, reasons };
    }

    // NFT Collector (NFT transactions)
    if (data.nftTransactions > 10) {
      personalityType = 4;
      confidence = 70;
      reasons.push(`Active in NFT transactions (${data.nftTransactions})`);
      return { type: personalityType, confidence, reasons };
    }

    // Default reasons for Cautious Trader
    reasons.push('Moderate activity levels');
    reasons.push('Conservative transaction patterns');

    return { type: personalityType, confidence, reasons };
  }

  private getModuleName(moduleAddress: string): string {
    // Map common module addresses to readable names
    const moduleNames: { [key: string]: string } = {
      '0x1': 'Aptos Framework',
      '0x3': 'Aptos Token',
      '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12': 'Aptos Names',
      // Add more mappings as needed
    };

    return moduleNames[moduleAddress] || `Module ${moduleAddress.slice(0, 8)}...`;
  }

  async getRecentTransactions(address: string, limit: number = 10): Promise<RecentTransaction[]> {
    try {
      const transactions = await this.client.getAccountTransactions(address, { limit });
      
      return transactions.map(tx => {
        const txData = tx as any;
        return {
          hash: txData.hash || 'unknown',
          timestamp: txData.timestamp ? new Date(txData.timestamp) : new Date(),
          type: this.categorizeTransaction(txData),
          status: txData.success === true ? 'success' : 'failed',
          gasUsed: parseInt(txData.gas_used || '0'),
          module: txData.payload?.function?.split('::')[0] || 'Unknown',
          description: this.generateTransactionDescription(txData)
        };
      });
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  private categorizeTransaction(tx: any): RecentTransaction['type'] {
    if (!tx.payload?.function) return 'other';
    
    const func = tx.payload.function.toLowerCase();
    
    if (func.includes('transfer')) return 'transfer';
    if (func.includes('swap') || func.includes('exchange')) return 'swap';
    if (func.includes('stake') || func.includes('delegate')) return 'stake';
    if (func.includes('liquidity') || func.includes('pool')) return 'liquidity';
    if (func.includes('nft') || func.includes('token')) return 'nft';
    
    return 'other';
  }

  private generateTransactionDescription(tx: any): string {
    if (!tx.payload?.function) return 'Contract interaction';
    
    const func = tx.payload.function;
    const type = this.categorizeTransaction(tx);
    
    switch (type) {
      case 'transfer':
        return 'Token transfer';
      case 'swap':
        return 'Token swap';
      case 'stake':
        return 'Staking operation';
      case 'liquidity':
        return 'Liquidity provision';
      case 'nft':
        return 'NFT transaction';
      default:
        return `${func.split('::').pop() || 'Contract interaction'}`;
    }
  }

  // Clear cache for testing or forced refresh
  clearCache(address?: string) {
    if (address) {
      this.cache.delete(address);
    } else {
      this.cache.clear();
    }
  }
}

// Export singleton instance
export const realWalletAnalyticsService = new RealWalletAnalyticsService();
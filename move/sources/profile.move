module wallet_persona::profile {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_PROFILE_NOT_FOUND: u64 = 3;
    const E_UNAUTHORIZED: u64 = 4;
    const E_INVALID_PERSONALITY: u64 = 5;
    const E_ACHIEVEMENT_NOT_FOUND: u64 = 6;

    // Personality types
    const DEFI_DEGEN: u8 = 1;
    const DIAMOND_HANDS: u8 = 2;
    const YIELD_FARMER: u8 = 3;
    const NFT_COLLECTOR: u8 = 4;
    const CAUTIOUS_TRADER: u8 = 5;
    const WHALE: u8 = 6;

    // Achievement types
    const FIRST_STEPS: u8 = 1;
    const CENTURY_CLUB: u8 = 2;
    const DEFI_EXPLORER: u8 = 3;
    const WHALE_STATUS: u8 = 4;
    const DIAMOND_HANDS_BADGE: u8 = 5;
    const YIELD_MASTER: u8 = 6;

    struct ProfileData has store, drop, copy {
        personality_type: u8,
        personality_emoji: String,
        personality_description: String,
        rarity_percentage: u64,
        traits: vector<String>,
        total_transactions: u64,
        portfolio_value: u64,
        total_volume: u64,
        active_protocols: u64,
        win_rate: u64,
        risk_score: u64,
        diversification_score: u64,
        created_at: u64,
        updated_at: u64,
    }

    struct Achievement has store, drop, copy {
        achievement_id: u8,
        name: String,
        description: String,
        rarity: String,
        emoji: String,
        earned: bool,
        progress: u64,
        earned_at: u64,
    }

    struct WalletProfile has key {
        profile: ProfileData,
        achievements: vector<Achievement>,
        total_achievements_earned: u64,
    }

    struct ProfileRegistry has key {
        profiles: Table<address, bool>,
        total_profiles: u64,
        personality_distribution: Table<u8, u64>,
    }

    struct ModuleData has key {
        admin: address,
        paused: bool,
    }

    // Events
    #[event]
    struct ProfileCreated has drop, store {
        user: address,
        personality_type: u8,
        timestamp: u64,
    }

    #[event]
    struct ProfileUpdated has drop, store {
        user: address,
        old_personality: u8,
        new_personality: u8,
        timestamp: u64,
    }

    #[event]
    struct AchievementEarned has drop, store {
        user: address,
        achievement_id: u8,
        timestamp: u64,
    }

    // Initialize the module
    fun init_module(admin: &signer) acquires ProfileRegistry {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, ModuleData {
            admin: admin_addr,
            paused: false,
        });

        move_to(admin, ProfileRegistry {
            profiles: table::new(),
            total_profiles: 0,
            personality_distribution: table::new(),
        });

        // Initialize personality distribution counters
        let personality_dist = &mut borrow_global_mut<ProfileRegistry>(admin_addr).personality_distribution;
        table::add(personality_dist, DEFI_DEGEN, 0);
        table::add(personality_dist, DIAMOND_HANDS, 0);
        table::add(personality_dist, YIELD_FARMER, 0);
        table::add(personality_dist, NFT_COLLECTOR, 0);
        table::add(personality_dist, CAUTIOUS_TRADER, 0);
        table::add(personality_dist, WHALE, 0);
    }

    // Create a new wallet profile
    public entry fun create_profile(
        user: &signer,
        personality_type: u8,
        total_transactions: u64,
        portfolio_value: u64,
        total_volume: u64,
        active_protocols: u64,
    ) acquires ProfileRegistry, ModuleData, WalletProfile {
        let user_addr = signer::address_of(user);
        
        // Check if module is paused
        let module_data = borrow_global<ModuleData>(@wallet_persona);
        assert!(!module_data.paused, error::unavailable(E_NOT_INITIALIZED));
        
        // Check if profile already exists
        assert!(!exists<WalletProfile>(user_addr), error::already_exists(E_ALREADY_INITIALIZED));
        
        // Validate personality type
        assert!(personality_type >= 1 && personality_type <= 6, error::invalid_argument(E_INVALID_PERSONALITY));

        let (emoji, description, rarity, traits) = get_personality_data(personality_type);
        
        let current_time = timestamp::now_seconds();
        
        // Calculate derived stats
        let win_rate = calculate_win_rate(total_transactions, total_volume);
        let risk_score = calculate_risk_score(personality_type, total_volume, portfolio_value);
        let diversification_score = calculate_diversification_score(active_protocols);

        let profile_data = ProfileData {
            personality_type,
            personality_emoji: emoji,
            personality_description: description,
            rarity_percentage: rarity,
            traits,
            total_transactions,
            portfolio_value,
            total_volume,
            active_protocols,
            win_rate,
            risk_score,
            diversification_score,
            created_at: current_time,
            updated_at: current_time,
        };

        // Initialize achievements
        let achievements = initialize_achievements();

        let wallet_profile = WalletProfile {
            profile: profile_data,
            achievements,
            total_achievements_earned: 0,
        };

        // Update registry
        let registry = borrow_global_mut<ProfileRegistry>(@wallet_persona);
        table::add(&mut registry.profiles, user_addr, true);
        registry.total_profiles = registry.total_profiles + 1;
        
        // Update personality distribution
        let current_count = table::borrow(&registry.personality_distribution, personality_type);
        table::upsert(&mut registry.personality_distribution, personality_type, *current_count + 1);

        move_to(user, wallet_profile);

        // Check and award initial achievements
        update_achievements(user_addr);

        // Emit event
        event::emit(ProfileCreated {
            user: user_addr,
            personality_type,
            timestamp: current_time,
        });
    }

    // Update profile data
    public entry fun update_profile(
        user: &signer,
        total_transactions: u64,
        portfolio_value: u64,
        total_volume: u64,
        active_protocols: u64,
    ) acquires WalletProfile, ModuleData {
        let user_addr = signer::address_of(user);
        
        // Check if module is paused
        let module_data = borrow_global<ModuleData>(@wallet_persona);
        assert!(!module_data.paused, error::unavailable(E_NOT_INITIALIZED));
        
        assert!(exists<WalletProfile>(user_addr), error::not_found(E_PROFILE_NOT_FOUND));

        let wallet_profile = borrow_global_mut<WalletProfile>(user_addr);
        let old_personality = wallet_profile.profile.personality_type;
        
        // Recalculate personality based on new data
        let new_personality = calculate_personality_type(
            total_transactions,
            portfolio_value,
            total_volume,
            active_protocols
        );

        // Update profile data
        wallet_profile.profile.total_transactions = total_transactions;
        wallet_profile.profile.portfolio_value = portfolio_value;
        wallet_profile.profile.total_volume = total_volume;
        wallet_profile.profile.active_protocols = active_protocols;
        wallet_profile.profile.win_rate = calculate_win_rate(total_transactions, total_volume);
        wallet_profile.profile.risk_score = calculate_risk_score(new_personality, total_volume, portfolio_value);
        wallet_profile.profile.diversification_score = calculate_diversification_score(active_protocols);
        wallet_profile.profile.updated_at = timestamp::now_seconds();

        // Update personality if it changed
        if (new_personality != old_personality) {
            let (emoji, description, rarity, traits) = get_personality_data(new_personality);
            wallet_profile.profile.personality_type = new_personality;
            wallet_profile.profile.personality_emoji = emoji;
            wallet_profile.profile.personality_description = description;
            wallet_profile.profile.rarity_percentage = rarity;
            wallet_profile.profile.traits = traits;

            event::emit(ProfileUpdated {
                user: user_addr,
                old_personality,
                new_personality,
                timestamp: timestamp::now_seconds(),
            });
        };

        // Update achievements
        update_achievements(user_addr);
    }

    // Get personality data based on type
    fun get_personality_data(personality_type: u8): (String, String, u64, vector<String>) {
        if (personality_type == DEFI_DEGEN) {
            (
                string::utf8(b"FIRE"),
                string::utf8(b"Bold, experimental, always hunting for yield"),
                15,
                vector[
                    string::utf8(b"Risk-taker"),
                    string::utf8(b"Early Adopter"),
                    string::utf8(b"Yield Hunter"),
                    string::utf8(b"Protocol Explorer")
                ]
            )
        } else if (personality_type == DIAMOND_HANDS) {
            (
                string::utf8(b"DIAMOND"),
                string::utf8(b"Patient, strong conviction, long-term focused"),
                28,
                vector[
                    string::utf8(b"HODLer"),
                    string::utf8(b"Patient"),
                    string::utf8(b"Strong Conviction"),
                    string::utf8(b"Long-term Vision")
                ]
            )
        } else if (personality_type == YIELD_FARMER) {
            (
                string::utf8(b"FARM"),
                string::utf8(b"Strategic, yield-focused, protocol optimizer"),
                19,
                vector[
                    string::utf8(b"Strategic"),
                    string::utf8(b"Yield Hunter"),
                    string::utf8(b"Protocol Optimizer"),
                    string::utf8(b"DeFi Native")
                ]
            )
        } else if (personality_type == NFT_COLLECTOR) {
            (
                string::utf8(b"ART"),
                string::utf8(b"Creative, trend-aware, community-driven"),
                19,
                vector[
                    string::utf8(b"Creative"),
                    string::utf8(b"Trend Setter"),
                    string::utf8(b"Community Focused"),
                    string::utf8(b"Art Enthusiast")
                ]
            )
        } else if (personality_type == CAUTIOUS_TRADER) {
            (
                string::utf8(b"SHIELD"),
                string::utf8(b"Conservative, risk-averse, steady growth"),
                25,
                vector[
                    string::utf8(b"Conservative"),
                    string::utf8(b"Risk Averse"),
                    string::utf8(b"Steady"),
                    string::utf8(b"Analytical")
                ]
            )
        } else {
            // WHALE
            (
                string::utf8(b"WHALE"),
                string::utf8(b"High-volume trader, market mover, influential"),
                5,
                vector[
                    string::utf8(b"High Volume"),
                    string::utf8(b"Market Mover"),
                    string::utf8(b"Influential"),
                    string::utf8(b"Deep Pockets")
                ]
            )
        }
    }

    // Calculate personality type based on user data
    fun calculate_personality_type(
        total_transactions: u64,
        portfolio_value: u64,
        total_volume: u64,
        active_protocols: u64,
    ): u8 {
        // Whale detection (high portfolio value)
        if (portfolio_value > 50000) {
            return WHALE
        };

        // High transaction activity with many protocols = DeFi Degen
        if (total_transactions > 100 && active_protocols > 10) {
            return DEFI_DEGEN
        };

        // High protocol usage with moderate volume = Yield Farmer
        if (active_protocols > 8 && total_volume > 10000) {
            return YIELD_FARMER
        };

        // Low transaction frequency but high volume = Diamond Hands
        if (total_transactions < 50 && portfolio_value > 10000) {
            return DIAMOND_HANDS
        };

        // Moderate activity = Cautious Trader
        CAUTIOUS_TRADER
    }

    // Initialize achievements for new profiles
    fun initialize_achievements(): vector<Achievement> {
        let achievements = vector::empty<Achievement>();
        
        vector::push_back(&mut achievements, Achievement {
            achievement_id: FIRST_STEPS,
            name: string::utf8(b"First Steps"),
            description: string::utf8(b"Made your first transaction"),
            rarity: string::utf8(b"Common"),
            emoji: string::utf8(b"FIRST"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        vector::push_back(&mut achievements, Achievement {
            achievement_id: CENTURY_CLUB,
            name: string::utf8(b"Century Club"),
            description: string::utf8(b"100+ transactions"),
            rarity: string::utf8(b"Uncommon"),
            emoji: string::utf8(b"100"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        vector::push_back(&mut achievements, Achievement {
            achievement_id: DEFI_EXPLORER,
            name: string::utf8(b"DeFi Explorer"),
            description: string::utf8(b"Used 10+ protocols"),
            rarity: string::utf8(b"Rare"),
            emoji: string::utf8(b"MAP"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        vector::push_back(&mut achievements, Achievement {
            achievement_id: WHALE_STATUS,
            name: string::utf8(b"Whale Status"),
            description: string::utf8(b"Portfolio > $10k"),
            rarity: string::utf8(b"Epic"),
            emoji: string::utf8(b"WHALE"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        vector::push_back(&mut achievements, Achievement {
            achievement_id: DIAMOND_HANDS_BADGE,
            name: string::utf8(b"Diamond Hands"),
            description: string::utf8(b"Hold 6+ months"),
            rarity: string::utf8(b"Legendary"),
            emoji: string::utf8(b"DIAMOND"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        vector::push_back(&mut achievements, Achievement {
            achievement_id: YIELD_MASTER,
            name: string::utf8(b"Yield Master"),
            description: string::utf8(b"Earn $1000+ in yield"),
            rarity: string::utf8(b"Legendary"),
            emoji: string::utf8(b"FARM"),
            earned: false,
            progress: 0,
            earned_at: 0,
        });

        achievements
    }

    // Update achievements based on current profile data
    fun update_achievements(user_addr: address) acquires WalletProfile {
        if (!exists<WalletProfile>(user_addr)) {
            return
        };

        let wallet_profile = borrow_global_mut<WalletProfile>(user_addr);
        let profile = &wallet_profile.profile;
        let current_time = timestamp::now_seconds();
        let achievements = &mut wallet_profile.achievements;

        let i = 0;
        let len = vector::length(achievements);
        while (i < len) {
            let achievement = vector::borrow_mut(achievements, i);
            let was_earned = achievement.earned;

            if (achievement.achievement_id == FIRST_STEPS && profile.total_transactions >= 1) {
                achievement.earned = true;
                achievement.progress = 100;
                if (!was_earned) achievement.earned_at = current_time;
            } else if (achievement.achievement_id == CENTURY_CLUB && profile.total_transactions >= 100) {
                achievement.earned = true;
                achievement.progress = 100;
                if (!was_earned) achievement.earned_at = current_time;
            } else if (achievement.achievement_id == DEFI_EXPLORER && profile.active_protocols >= 10) {
                achievement.earned = true;
                achievement.progress = 100;
                if (!was_earned) achievement.earned_at = current_time;
            } else if (achievement.achievement_id == WHALE_STATUS && profile.portfolio_value >= 10000) {
                achievement.earned = true;
                achievement.progress = 100;
                if (!was_earned) achievement.earned_at = current_time;
            } else {
                // Update progress for unearned achievements
                if (achievement.achievement_id == CENTURY_CLUB && profile.total_transactions < 100) {
                    achievement.progress = (profile.total_transactions * 100) / 100;
                } else if (achievement.achievement_id == DEFI_EXPLORER && profile.active_protocols < 10) {
                    achievement.progress = (profile.active_protocols * 100) / 10;
                } else if (achievement.achievement_id == WHALE_STATUS && profile.portfolio_value < 10000) {
                    achievement.progress = (profile.portfolio_value * 100) / 10000;
                };
            };

            // Emit event for newly earned achievements
            if (!was_earned && achievement.earned) {
                wallet_profile.total_achievements_earned = wallet_profile.total_achievements_earned + 1;
                event::emit(AchievementEarned {
                    user: user_addr,
                    achievement_id: achievement.achievement_id,
                    timestamp: current_time,
                });
            };

            i = i + 1;
        };
    }

    // Helper functions for calculations
    fun calculate_win_rate(total_transactions: u64, total_volume: u64): u64 {
        if (total_transactions == 0) return 0;
        
        // Simple heuristic: higher volume per transaction suggests better performance
        let avg_volume = total_volume / total_transactions;
        if (avg_volume > 1000) {
            75
        } else if (avg_volume > 500) {
            65
        } else if (avg_volume > 100) {
            55
        } else {
            45
        }
    }

    fun calculate_risk_score(personality_type: u8, total_volume: u64, portfolio_value: u64): u64 {
        let base_risk = if (personality_type == DEFI_DEGEN) {
            85
        } else if (personality_type == YIELD_FARMER) {
            70
        } else if (personality_type == NFT_COLLECTOR) {
            60
        } else if (personality_type == WHALE) {
            50
        } else if (personality_type == DIAMOND_HANDS) {
            30
        } else {
            // CAUTIOUS_TRADER
            20
        };

        // Adjust based on volume/portfolio ratio
        if (portfolio_value > 0 && total_volume > portfolio_value * 5) {
            base_risk + 10
        } else {
            base_risk
        }
    }

    fun calculate_diversification_score(active_protocols: u64): u64 {
        if (active_protocols > 20) {
            95
        } else if (active_protocols > 15) {
            85
        } else if (active_protocols > 10) {
            75
        } else if (active_protocols > 5) {
            60
        } else if (active_protocols > 2) {
            40
        } else {
            20
        }
    }

    // View functions
    #[view]
    public fun get_profile(user_addr: address): (ProfileData, vector<Achievement>, u64) acquires WalletProfile {
        assert!(exists<WalletProfile>(user_addr), error::not_found(E_PROFILE_NOT_FOUND));
        let wallet_profile = borrow_global<WalletProfile>(user_addr);
        (wallet_profile.profile, wallet_profile.achievements, wallet_profile.total_achievements_earned)
    }

    #[view]
    public fun profile_exists(user_addr: address): bool {
        exists<WalletProfile>(user_addr)
    }

    #[view]
    public fun get_personality_count(personality_type: u8): u64 acquires ProfileRegistry {
        let registry = borrow_global<ProfileRegistry>(@wallet_persona);
        if (table::contains(&registry.personality_distribution, personality_type)) {
            *table::borrow(&registry.personality_distribution, personality_type)
        } else {
            0
        }
    }

    #[view]
    public fun get_total_profiles(): u64 acquires ProfileRegistry {
        borrow_global<ProfileRegistry>(@wallet_persona).total_profiles
    }

    // Admin functions
    public entry fun pause_module(admin: &signer) acquires ModuleData {
        let admin_addr = signer::address_of(admin);
        let module_data = borrow_global_mut<ModuleData>(@wallet_persona);
        assert!(module_data.admin == admin_addr, error::permission_denied(E_UNAUTHORIZED));
        module_data.paused = true;
    }

    public entry fun unpause_module(admin: &signer) acquires ModuleData {
        let admin_addr = signer::address_of(admin);
        let module_data = borrow_global_mut<ModuleData>(@wallet_persona);
        assert!(module_data.admin == admin_addr, error::permission_denied(E_UNAUTHORIZED));
        module_data.paused = false;
    }
}
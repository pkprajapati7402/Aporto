module wallet_persona::profile_tests {
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use wallet_persona::profile;
    use std::signer;
    use std::vector;

    #[test(admin = @wallet_persona, user1 = @0x123, user2 = @0x456)]
    public fun test_create_profile_success(admin: &signer, user1: &signer, user2: &signer) {
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        // Initialize the module
        profile::init_module(admin);
        
        // Test profile creation
        profile::create_profile(
            user1,
            1, // DEFI_DEGEN
            150, // total_transactions
            5000, // portfolio_value
            25000, // total_volume
            12 // active_protocols
        );
        
        // Verify profile exists
        assert!(profile::profile_exists(signer::address_of(user1)), 1);
        
        // Get profile data
        let (profile_data, achievements, total_earned) = profile::get_profile(signer::address_of(user1));
        
        // Verify profile data
        assert!(profile_data.personality_type == 1, 2);
        assert!(profile_data.total_transactions == 150, 3);
        assert!(profile_data.portfolio_value == 5000, 4);
        assert!(profile_data.total_volume == 25000, 5);
        assert!(profile_data.active_protocols == 12, 6);
        
        // Verify achievements initialization
        assert!(vector::length(&achievements) == 6, 7);
        
        // Test second profile
        profile::create_profile(
            user2,
            2, // DIAMOND_HANDS
            25, // total_transactions
            15000, // portfolio_value
            30000, // total_volume
            5 // active_protocols
        );
        
        assert!(profile::profile_exists(signer::address_of(user2)), 8);
        
        // Verify total profiles count
        assert!(profile::get_total_profiles() == 2, 9);
    }

    #[test(admin = @wallet_persona, user = @0x123)]
    public fun test_update_profile_success(admin: &signer, user: &signer) {
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        profile::init_module(admin);
        
        // Create initial profile
        profile::create_profile(
            user,
            5, // CAUTIOUS_TRADER
            50, // total_transactions
            8000, // portfolio_value
            15000, // total_volume
            3 // active_protocols
        );
        
        let (initial_profile, _, _) = profile::get_profile(signer::address_of(user));
        assert!(initial_profile.personality_type == 5, 1);
        
        // Update profile with more aggressive stats
        profile::update_profile(
            user,
            120, // total_transactions (increased)
            12000, // portfolio_value (increased)
            50000, // total_volume (increased)
            15 // active_protocols (increased)
        );
        
        let (updated_profile, updated_achievements, _) = profile::get_profile(signer::address_of(user));
        
        // Verify stats updated
        assert!(updated_profile.total_transactions == 120, 2);
        assert!(updated_profile.portfolio_value == 12000, 3);
        assert!(updated_profile.total_volume == 50000, 4);
        assert!(updated_profile.active_protocols == 15, 5);
        
        // Personality should change to DeFi Degen due to high activity
        assert!(updated_profile.personality_type == 1, 6);
        
        // Check achievements were updated
        let i = 0;
        let len = vector::length(&updated_achievements);
        let century_club_earned = false;
        let defi_explorer_earned = false;
        let whale_earned = false;
        
        while (i < len) {
            let achievement = vector::borrow(&updated_achievements, i);
            if (achievement.achievement_id == 2 && achievement.earned) { // CENTURY_CLUB
                century_club_earned = true;
            };
            if (achievement.achievement_id == 3 && achievement.earned) { // DEFI_EXPLORER
                defi_explorer_earned = true;
            };
            if (achievement.achievement_id == 4 && achievement.earned) { // WHALE_STATUS
                whale_earned = true;
            };
            i = i + 1;
        };
        
        assert!(century_club_earned, 7); // Should earn Century Club (100+ transactions)
        assert!(defi_explorer_earned, 8); // Should earn DeFi Explorer (10+ protocols)
        assert!(whale_earned, 9); // Should earn Whale Status ($10k+ portfolio)
    }

    #[test(admin = @wallet_persona, user = @0x123)]
    #[expected_failure(abort_code = 0x60002)] // E_ALREADY_INITIALIZED
    public fun test_create_profile_duplicate_fails(admin: &signer, user: &signer) {
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        profile::init_module(admin);
        
        // Create first profile
        profile::create_profile(user, 1, 100, 5000, 20000, 10);
        
        // Try to create another profile for the same user (should fail)
        profile::create_profile(user, 2, 200, 10000, 40000, 15);
    }

    #[test(admin = @wallet_persona, user = @0x123)]
    #[expected_failure(abort_code = 0x60003)] // E_PROFILE_NOT_FOUND
    public fun test_update_nonexistent_profile_fails(admin: &signer, user: &signer) {
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        profile::init_module(admin);
        
        // Try to update profile without creating it first (should fail)
        profile::update_profile(user, 100, 5000, 20000, 10);
    }

    #[test(admin = @wallet_persona, user = @0x123)]
    #[expected_failure(abort_code = 0x60005)] // E_INVALID_PERSONALITY
    public fun test_create_profile_invalid_personality_fails(admin: &signer, user: &signer) {
        timestamp::set_time_has_started_for_testing(&account::create_signer_for_test(@0x1));
        
        profile::init_module(admin);
        
        // Try to create profile with invalid personality type (should fail)
        profile::create_profile(user, 7, 100, 5000, 20000, 10); // Invalid personality type
    }

    #[test(admin = @wallet_persona)]
    public fun test_admin_pause_unpause(admin: &signer) {
        profile::init_module(admin);
        
        // Test pause
        profile::pause_module(admin);
        
        // Test unpause
        profile::unpause_module(admin);
    }

    #[test(admin = @wallet_persona, non_admin = @0x123)]
    #[expected_failure(abort_code = 0x50004)] // E_UNAUTHORIZED
    public fun test_non_admin_pause_fails(admin: &signer, non_admin: &signer) {
        profile::init_module(admin);
        
        // Non-admin tries to pause (should fail)
        profile::pause_module(non_admin);
    }
}
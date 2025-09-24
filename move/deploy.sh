#!/bin/bash

# Aporto Move Smart Contract Deployment Script
# This script deploys the wallet_persona module to Aptos testnet

echo "🚀 Starting Aporto Smart Contract Deployment..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null
then
    echo "❌ Aptos CLI not found. Please install it first:"
    echo "curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "Move.toml" ]; then
    echo "❌ Move.toml not found. Please run this script from the move directory."
    exit 1
fi

# Compile the Move module
echo "📦 Compiling Move modules..."
aptos move compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed. Please check your Move code."
    exit 1
fi

echo "✅ Compilation successful!"

# Check if .aptos/config.yaml exists for account setup
if [ ! -f "$HOME/.aptos/config.yaml" ]; then
    echo "🔑 Setting up Aptos account..."
    echo "Please follow the prompts to create or recover your account:"
    aptos init --network testnet
else
    echo "✅ Aptos account already configured"
fi

# Get the account address
ACCOUNT_ADDRESS=$(aptos account lookup-address)
echo "📍 Deploying from account: $ACCOUNT_ADDRESS"

# Fund the account with testnet APT
echo "💰 Funding account with testnet APT..."
aptos account fund-with-faucet --account $ACCOUNT_ADDRESS --amount 100000000

# Replace the placeholder address in Move.toml
echo "🔧 Updating Move.toml with account address..."
sed -i.bak "s/wallet_persona = \"_\"/wallet_persona = \"$ACCOUNT_ADDRESS\"/" Move.toml

# Deploy the module
echo "🚀 Deploying smart contract to testnet..."
aptos move publish --named-addresses wallet_persona=$ACCOUNT_ADDRESS

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "📝 Contract deployed at address: $ACCOUNT_ADDRESS"
    echo "🌐 View on explorer: https://explorer.aptoslabs.com/account/$ACCOUNT_ADDRESS?network=testnet"
    echo ""
    echo "📋 Important information:"
    echo "- Module address: $ACCOUNT_ADDRESS::profile"
    echo "- Network: Aptos Testnet"
    echo "- Make sure to update your frontend with this address!"
    
    # Create a deployment info file
    cat > deployment_info.json << EOF
{
  "network": "testnet",
  "module_address": "$ACCOUNT_ADDRESS",
  "module_name": "profile",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "explorer_url": "https://explorer.aptoslabs.com/account/$ACCOUNT_ADDRESS?network=testnet"
}
EOF
    echo "💾 Deployment info saved to deployment_info.json"
    
else
    echo "❌ Deployment failed. Please check the error messages above."
    # Restore the original Move.toml
    mv Move.toml.bak Move.toml
    exit 1
fi

# Clean up backup
rm -f Move.toml.bak

echo "✨ Deployment process completed!"
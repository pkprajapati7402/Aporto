# Aporto Move Smart Contract Deployment Script for Windows
# This script deploys the wallet_persona module to Aptos testnet

Write-Host "🚀 Starting Aporto Smart Contract Deployment..." -ForegroundColor Green

# Check if Aptos CLI is installed
$aptosCmd = Get-Command aptos -ErrorAction SilentlyContinue
if (-not $aptosCmd) {
    Write-Host "❌ Aptos CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "Download from: https://github.com/aptos-labs/aptos-core/releases" -ForegroundColor Yellow
    Write-Host "Or use: winget install --id Aptos.AptosCLI" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "Move.toml")) {
    Write-Host "❌ Move.toml not found. Please run this script from the move directory." -ForegroundColor Red
    exit 1
}

# Compile the Move module
Write-Host "📦 Compiling Move modules..." -ForegroundColor Blue
aptos move compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Compilation failed. Please check your Move code." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation successful!" -ForegroundColor Green

# Check if .aptos/config.yaml exists for account setup
$aptosConfigPath = "$env:USERPROFILE\.aptos\config.yaml"
if (-not (Test-Path $aptosConfigPath)) {
    Write-Host "🔑 Setting up Aptos account..." -ForegroundColor Yellow
    Write-Host "Please follow the prompts to create or recover your account:" -ForegroundColor Yellow
    aptos init --network testnet
} else {
    Write-Host "✅ Aptos account already configured" -ForegroundColor Green
}

# Get the account address
$accountAddress = (aptos account lookup-address | Out-String).Trim()
Write-Host "📍 Deploying from account: $accountAddress" -ForegroundColor Cyan

# Fund the account with testnet APT
Write-Host "💰 Funding account with testnet APT..." -ForegroundColor Blue
aptos account fund-with-faucet --account $accountAddress --amount 100000000

# Create backup of Move.toml
Copy-Item "Move.toml" "Move.toml.bak"

# Replace the placeholder address in Move.toml
Write-Host "🔧 Updating Move.toml with account address..." -ForegroundColor Blue
$moveTomlContent = Get-Content "Move.toml" -Raw
$moveTomlContent = $moveTomlContent -replace 'wallet_persona = "_"', "wallet_persona = `"$accountAddress`""
Set-Content "Move.toml" -Value $moveTomlContent

# Deploy the module
Write-Host "🚀 Deploying smart contract to testnet..." -ForegroundColor Blue
aptos move publish --named-addresses wallet_persona=$accountAddress

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "📝 Contract deployed at address: $accountAddress" -ForegroundColor Cyan
    Write-Host "🌐 View on explorer: https://explorer.aptoslabs.com/account/$accountAddress" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Important information:" -ForegroundColor Yellow
    Write-Host "- Module address: $accountAddress::profile" -ForegroundColor White
    Write-Host "- Network: Aptos Testnet" -ForegroundColor White
    Write-Host "- Make sure to update your frontend with this address!" -ForegroundColor White
    
    # Create a deployment info file
    $deploymentInfo = @{
        network = "testnet"
        module_address = $accountAddress
        module_name = "profile"
        deployed_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        explorer_url = "https://explorer.aptoslabs.com/account/$accountAddress?network=testnet"
    }
    
    $deploymentInfo | ConvertTo-Json -Depth 3 | Set-Content "deployment_info.json"
    Write-Host "💾 Deployment info saved to deployment_info.json" -ForegroundColor Green
    
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
    # Restore the original Move.toml
    Move-Item "Move.toml.bak" "Move.toml" -Force
    exit 1
}

# Clean up backup
Remove-Item "Move.toml.bak" -ErrorAction SilentlyContinue

Write-Host "✨ Deployment process completed!" -ForegroundColor Green
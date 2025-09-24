# 🚀 Aporto - Crypto Wallet Personality Platform

Discover your unique crypto personality through AI-powered analysis of your Aptos wallet. Mint your personality profile as an NFT on the blockchain and track your achievements in the DeFi space.

## ✨ Features

- **🔍 AI Wallet Analysis**: Advanced algorithm analyzes your transaction patterns
- **🎭 Personality Types**: 8 unique crypto personalities with traits and descriptions  
- **🏆 Achievement System**: Earn badges for milestones and trading patterns
- **📊 Portfolio Analytics**: Real-time portfolio tracking and risk analysis
- **🌐 On-Chain Profiles**: Mint your personality as an NFT on Aptos blockchain
- **📱 Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Aptos, Move language
- **Wallet Integration**: Aptos Wallet Adapter
- **State Management**: React Context API
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Git
- Aptos CLI (for smart contract deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aporto.git
cd aporto
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Smart Contract Deployment

### 1. Install Aptos CLI

**Windows (PowerShell)**:
```powershell
# Download and install from official releases
iwr "https://github.com/aptos-labs/aptos-core/releases/latest/download/aptos-cli-win-x64.zip" -OutFile "aptos-cli.zip"
Expand-Archive -Path "aptos-cli.zip" -DestinationPath "C:\aptos-cli"
$env:PATH += ";C:\aptos-cli"
```

**macOS/Linux**:
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### 2. Initialize Aptos Account

```bash
aptos init --network testnet
```

This will create a `.aptos/config.yaml` file with your account information.

### 3. Fund Your Account

Get testnet APT from the [Aptos Faucet](https://www.aptoslabs.com/faucet):
```bash
aptos account fund-with-faucet --account <your-address>
```

### 4. Deploy the Smart Contract

**Using PowerShell (Windows)**:
```powershell
cd move
.\deploy.ps1
```

**Using Bash (macOS/Linux)**:
```bash
cd move
chmod +x deploy.sh
./deploy.sh
```

### 5. Update Environment Variables

After successful deployment, update your `.env.local` file:
```env
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_DEPLOYED_ADDRESS_HERE
```

## 📁 Project Structure

```
aporto/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts
│   │   └── WalletContext.tsx   # Wallet connection logic
│   ├── hooks/                  # Custom React hooks
│   │   └── useProfile.ts       # Profile management hooks
│   └── services/               # Business logic
│       └── aptosProfileService.ts  # Blockchain integration
├── move/                       # Move smart contracts
│   ├── sources/
│   │   ├── profile.move        # Main profile contract
│   │   └── profile_tests.move  # Test suite
│   ├── Move.toml              # Move package config
│   ├── deploy.ps1             # Windows deployment script
│   └── deploy.sh              # Unix deployment script
├── public/                     # Static assets
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🎯 Smart Contract Architecture

### ProfileData Structure
```move
struct ProfileData has key, store {
    personality_type: u8,
    total_transactions: u64,
    portfolio_value: u64,
    total_volume: u64,
    active_protocols: u64,
    win_rate: u8,
    risk_score: u8,
    diversification_score: u8,
    created_at: u64,
    updated_at: u64,
    rarity_percentage: u8,
}
```

### Key Functions
- `create_profile()` - Mint a new profile NFT
- `update_profile()` - Update existing profile data  
- `get_profile()` - Retrieve profile information
- `add_achievement()` - Award new achievements
- `get_achievements()` - Get user achievements

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
# or
yarn test
```

### Run Smart Contract Tests
```bash
cd move
aptos move test
```

### Test the Integration
1. Connect your Aptos wallet
2. The app will analyze your wallet transactions
3. Create your on-chain profile
4. View your personality type and achievements
5. Explore the dashboard analytics

## 🌟 Personality Types

The platform identifies 8 unique crypto personalities:

1. **🦅 Degen Gambler** - High-risk, high-reward trader
2. **💎 Diamond Hands** - Long-term HODLer 
3. **🤖 Strategy Bot** - Methodical, calculated trader
4. **🏦 Yield Farmer** - DeFi protocol maximizer
5. **🎯 Sharp Trader** - Precise market timer
6. **🌊 Market Rider** - Trend follower
7. **🔍 Research Guru** - Data-driven investor
8. **🚀 Early Adopter** - New protocol explorer

## 🏆 Achievement System

Earn badges for various milestones:
- **First Steps** - Make your first transaction
- **Century Club** - Complete 100+ transactions  
- **DeFi Explorer** - Use 10+ protocols
- **Whale Status** - Portfolio over $10k
- **Diamond Hands** - Hold for 6+ months
- **Yield Master** - Earn $1000+ in yield

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Reporting Issues
Please use the GitHub Issues page to report bugs or request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Aptos Foundation](https://aptoslabs.com/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

For support, email support@aporto.dev or join our Discord community.

---

**Made with ❤️ for the Aptos ecosystem**

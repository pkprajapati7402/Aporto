# Aporto - Aptos Wallet Portfolio

A modern Web3 application for discovering your crypto personality on the Aptos blockchain. Connect your Aptos wallet to unlock achievements, view analytics, and share your unique DeFi journey.

## 🚀 Features

- **🔗 Multi-Wallet Support**: Connect with Petra, Pontem, Fewcha, and other Aptos wallets
- **📊 Portfolio Analytics**: Beautiful visualizations of your transaction history (Coming Soon)
- **🏆 Achievement System**: Unlock badges based on your trading behavior (Coming Soon)
- **👥 Social Profiles**: Create shareable profiles and compare with friends (Coming Soon)
- **🔒 Privacy First**: Only reads public blockchain data, no private key access

## 🛠️ Supported Wallets

### Recommended Wallets:
- **[Petra Wallet](https://petra.app/)** 🦊 - Most popular Aptos wallet
- **[Pontem Wallet](https://pontem.network/)** 🔧 - Developer-friendly wallet  
- **[Fewcha](https://fewcha.app/)** ⚡ - Fast and lightweight wallet

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- An Aptos wallet installed in your browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/aporto.git
cd aporto
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. **Install a Wallet**: If you don't have an Aptos wallet, we recommend starting with [Petra Wallet](https://petra.app/)

2. **Connect Your Wallet**: Click the "Connect Wallet" button and select your preferred wallet

3. **Grant Permissions**: Approve the connection request in your wallet

4. **Explore**: Visit your dashboard to see your account information and get ready for upcoming features!

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **Wallet Integration**: Aptos Labs Wallet Adapter
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📱 Wallet Connection

The app uses the official Aptos Wallet Adapter to provide seamless integration with popular Aptos wallets:

```typescript
// Supported wallet adapters
- PetraWallet
- PontemWallet  
- FewchaWallet
```

### Wallet Detection

- **Installed Wallets**: Shows "Connect" button for installed wallets
- **Missing Wallets**: Shows "Install" link with direct download URLs
- **Auto-Connect**: Automatically reconnects to previously connected wallets

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── page.tsx        # Landing page
│   ├── layout.tsx      # Root layout with wallet provider
│   └── dashboard/      # Dashboard page
├── components/         
│   ├── WalletProvider.tsx    # Wallet adapter configuration
│   └── WalletConnect.tsx     # Wallet connection components
└── public/
    └── manifest.json   # dApp manifest for wallet integration
```

### Environment Variables
No environment variables are required for basic wallet connection. The app runs on Aptos testnet by default.

## 🌐 Network Configuration

- **Default Network**: Aptos Testnet
- **Production**: Switch to Mainnet in `WalletProvider.tsx`:
  ```typescript
  network: NetworkName.Mainnet
  ```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Elegant dark mode design
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: User feedback during wallet operations
- **Error Handling**: Graceful error messages and recovery

## 🔒 Security

- **Read-Only Access**: Only reads public blockchain data
- **No Private Keys**: Never asks for or stores private keys
- **Secure Connections**: All wallet communications use secure protocols
- **User Control**: Users control all data sharing permissions

## 🚧 Coming Soon

- 📊 **Transaction Analytics**: Detailed insights into your trading patterns
- 🏆 **Achievement Badges**: Unlock unique NFT badges based on milestones
- 👥 **Social Features**: Compare stats and share achievements with friends
- 💼 **Portfolio Tracking**: Multi-asset portfolio monitoring
- 🎯 **DeFi Integration**: Track liquidity positions and yield farming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Wallet Connection Issues**: Ensure your wallet is installed and unlocked
2. **Network Issues**: Check you're on the correct Aptos network
3. **Performance Issues**: Try refreshing the page or clearing browser cache

For bugs and feature requests, please [open an issue](https://github.com/your-username/aporto/issues).

## 🌟 Acknowledgments

- Aptos Labs for the excellent wallet adapter
- The Aptos community for continuous support
- All wallet providers for their integration support

---

Built with ❤️ for the Aptos ecosystem 🚀
# Aporto Deployment Guide

## Prerequisites Checklist

- [x] Smart contract compiles successfully
- [x] Frontend integration complete
- [x] Environment configuration ready
- [ ] Aptos CLI installed
- [ ] Testnet account funded
- [ ] Module deployed

## Step-by-Step Deployment

### 1. Install Aptos CLI

**Windows PowerShell:**
```powershell
# Download Aptos CLI
iwr "https://github.com/aptos-labs/aptos-core/releases/latest/download/aptos-cli-win-x64.zip" -OutFile "aptos-cli.zip"
Expand-Archive -Path "aptos-cli.zip" -DestinationPath "$env:USERPROFILE\.aptos-cli"
$env:PATH += ";$env:USERPROFILE\.aptos-cli"
```

**macOS/Linux:**
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### 2. Initialize Aptos Account

```bash
cd move
aptos init --network testnet
```

This creates `.aptos/config.yaml` with your account details.

### 3. Fund Your Account

Visit [Aptos Faucet](https://www.aptoslabs.com/faucet) or run:
```bash
aptos account fund-with-faucet --account <your-address>
```

### 4. Deploy Smart Contract

**Windows:**
```powershell
cd move
.\deploy.ps1
```

**macOS/Linux:**
```bash
cd move
chmod +x deploy.sh
./deploy.sh
```

### 5. Update Environment Variables

After deployment, update `.env.local`:
```env
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```

### 6. Test the Application

1. Start the frontend:
```bash
npm run dev
```

2. Connect your Aptos wallet
3. Create your profile
4. Verify data is stored on-chain

## Troubleshooting

### Contract Won't Compile
- Check for Unicode characters (use ASCII only)
- Verify all `acquires` annotations are correct
- Ensure imports are properly used

### Deployment Fails
- Check account balance (need APT for gas)
- Verify network configuration
- Check module address format

### Frontend Integration Issues
- Verify module address in environment variables
- Check wallet connection status
- Ensure transaction payload format is correct

## Next Steps After Deployment

1. **Test Profile Creation**: Create profiles for different wallet types
2. **Verify Achievements**: Test achievement system with different scenarios  
3. **Monitor Gas Usage**: Track transaction costs
4. **Scale Testing**: Test with multiple users
5. **Mainnet Deployment**: Deploy to mainnet when ready

## Important Notes

- Keep your private keys secure
- Test thoroughly on testnet before mainnet
- Monitor contract events for debugging
- Consider upgradeability for future improvements

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify wallet connection and network
3. Review transaction details on Aptos Explorer
4. Check environment variable configuration

---

**Successfully deployed? Update the README with the deployed contract address!**
# Snoopy - Ethereum Readability Tool

A Chrome extension that enhances readability and verification of Web3 transactions. While initially focused on Safe transactions, it now includes ENS resolution and configurable parser settings.

## Credits

The Safe transaction hash calculation features were heavily inspired by [@pcaversaccio](https://github.com/pcaversaccio)'s [safe-tx-hashes-util](https://github.com/pcaversaccio/safe-tx-hashes-util) repository.

## Features

### 1. Safe Transaction Parser
- Calculate and verify transaction hashes
- Support for multiple networks and protocols
- Real-time updates as transaction details change
- Extracts transaction details from Safe UI
- Calculates Domain Hash, Message Hash, and Safe Transaction Hash
- Helps hardware wallet users verify signing data
- Supports multiple networks (Ethereum, Polygon, etc.)

### 2. ENS Resolution
- Automatically detects Ethereum addresses across any webpage
- Resolves and replaces addresses with their corresponding ENS names
- Shows original address in tooltip on hover
- Visual highlighting of replaced addresses

### 3. Parser Settings
- Toggle individual parsers on/off
- Settings persist across browser sessions
- Real-time parser enabling/disabling

## Local Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   - Run `npm install` to install all required packages

3. Build the extension:
   - Run `npm run build` to create a production build
   - The built extension will be in the `dist` folder

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

## Usage

### Safe Transaction Parsing
1. Navigate to a Safe transaction page:
   - Go to `https://app.safe.global/`
   - Connect your wallet and select your Safe
   - Navigate to the Queue tab
   - The URL should look like: `https://app.safe.global/transactions/queue?safe=<network>:<address>`

2. Click the extension icon in your Chrome toolbar

3. The extension will automatically:
   - Detect the current network and Safe address
   - Parse the transaction nonce
   - Calculate the relevant hashes

4. Compare the displayed hashes:
   - Domain Hash
   - Message Hash
   - Safe Tx Hash

### ENS Resolution
1. Visit any webpage containing Ethereum addresses
2. The extension will automatically:
   - Detect Ethereum addresses
   - Replace them with ENS names (if available)
   - Show the original address in a tooltip on hover

### Parser Settings
1. Click the extension icon in your Chrome toolbar
2. Use the checkboxes to enable/disable specific parsers:
   - GnosisSafeParser: For Safe transaction parsing
   - ENSResolver: For ENS name resolution
3. Changes take effect immediately

## Development

- Run in watch mode: `npm start`
- Build for production: `npm run build`
- Run linter: `npm run lint`
- Type check: `npm run type-check`

### Adding New Parsers
The extension is designed to be extensible. To add support for a new protocol:
1. Create a new parser in `src/parsers/`
2. Implement the `WebsiteParser` interface
3. Register the parser in `ParserRegistry`

## Troubleshooting

If the extension isn't working:

1. Verify you're on a supported page:
   - Check the URL matches the expected format
   - Ensure you're on the correct page within the dApp
   - Verify the site is in the supported list

2. Check common issues:
   - The page might still be loading
   - Required data might not be visible yet
   - You might need to refresh the page

3. If problems persist:
   - Check the browser console for errors
   - Try disabling and re-enabling the extension
   - Ensure you're using a supported network

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

Some components, particularly the Safe transaction hash calculation features, are derived from [safe-tx-hashes-util](https://github.com/pcaversaccio/safe-tx-hashes-util).

## Security

This extension is provided as-is. Always verify transaction details on your hardware wallet or preferred signing device before confirming any transactions.

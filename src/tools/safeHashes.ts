// @license GNU Affero General Public License v3.0 only
// @author Original: pcaversaccio (Bash)

import { ethers } from 'ethers';

// Type hash constants
const DOMAIN_SEPARATOR_TYPEHASH = "0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218";
const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8";

// API URLs for supported networks
const API_URLS = {
    arbitrum: "https://safe-transaction-arbitrum.safe.global",
    aurora: "https://safe-transaction-aurora.safe.global",
    avalanche: "https://safe-transaction-avalanche.safe.global",
    base: "https://safe-transaction-base.safe.global",
    "base-sepolia": "https://safe-transaction-base-sepolia.safe.global",
    blast: "https://safe-transaction-blast.safe.global",
    bsc: "https://safe-transaction-bsc.safe.global",
    celo: "https://safe-transaction-celo.safe.global",
    ethereum: "https://safe-transaction-mainnet.safe.global",
    gnosis: "https://safe-transaction-gnosis-chain.safe.global",
    "gnosis-chiado": "https://safe-transaction-chiado.safe.global",
    linea: "https://safe-transaction-linea.safe.global",
    mantle: "https://safe-transaction-mantle.safe.global",
    optimism: "https://safe-transaction-optimism.safe.global",
    polygon: "https://safe-transaction-polygon.safe.global",
    "polygon-zkevm": "https://safe-transaction-zkevm.safe.global",
    scroll: "https://safe-transaction-scroll.safe.global",
    sepolia: "https://safe-transaction-sepolia.safe.global",
    worldchain: "https://safe-transaction-worldchain.safe.global",
    xlayer: "https://safe-transaction-xlayer.safe.global",
    zksync: "https://safe-transaction-zksync.safe.global"
};

// Chain IDs for supported networks
const CHAIN_IDS = {
    arbitrum: "42161",
    aurora: "1313161554",
    avalanche: "43114",
    base: "8453",
    "base-sepolia": "84532",
    blast: "81457",
    bsc: "56",
    celo: "42220",
    ethereum: "1",
    gnosis: "100",
    "gnosis-chiado": "10200",
    linea: "59144",
    mantle: "5000",
    optimism: "10",
    polygon: "137",
    "polygon-zkevm": "1101",
    scroll: "534352",
    sepolia: "11155111",
    worldchain: "480",
    xlayer: "195",
    zksync: "324"
};

// Add this type definition at the top
export type NetworkType = keyof typeof API_URLS;

class SafeTransactionCalculator {
    private provider: ethers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.JsonRpcProvider();
    }

    // Utility function to validate network name
    validateNetwork(network: NetworkType) {
        if (!API_URLS[network] || !CHAIN_IDS[network]) {
            throw new Error(`Invalid network name: "${network}"`);
        }
    }
    // Utility function to validate Ethereum address
    validateAddress(address: string) {
        if (!ethers.isAddress(address)) {
            throw new Error(`Invalid Ethereum address format: "${address}"`);
        }
    }

    // Utility function to validate nonce
    validateNonce(nonce: number): void {
        if (!Number.isInteger(Number(nonce)) || Number(nonce) < 0) {
            throw new Error(`Invalid nonce value: "${nonce}". Must be a non-negative integer!`);
        }
    }

    // Format hash to match Ledger display format
    formatHash(hash: string): string {
        const prefix = hash.slice(0, 2).toLowerCase();
        const rest = hash.slice(2).toUpperCase();
        return `${prefix}${rest}`;
    }

    // Calculate domain and message hashes
    calculateHashes(params: {
        chainId: string;
        address: string;
        to: string;
        value: string;
        data: string;
        operation: string;
        safeTxGas: string;
        baseGas: string;
        gasPrice: string;
        gasToken: string;
        refundReceiver: string;
        nonce: number;
    }) {
        const {
            chainId,
            address,
            to,
            value,
            data,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            refundReceiver,
            nonce
        } = params;

        // Calculate domain hash using ethers.utils.solidityKeccak256
        const domainSeparator = ethers.solidityPackedKeccak256(
            ['bytes32', 'uint256', 'address'],
            [DOMAIN_SEPARATOR_TYPEHASH, chainId, address]
        );

        // Calculate data hash
        const dataHash = ethers.keccak256(data);

        // Encode the message using ethers.utils.solidityPack
        const encodedMessage = ethers.solidityPacked(
            ['bytes32', 'address', 'uint256', 'bytes32', 'uint8', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256'],
            [SAFE_TX_TYPEHASH, to, value, dataHash, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce]
        );

        // Calculate message hash
        const messageHash = ethers.keccak256(encodedMessage);

        // Calculate Safe transaction hash
        const safeTxHash = ethers.solidityPackedKeccak256(
            ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
            ['0x19', '0x01', domainSeparator, messageHash]
        );

        return {
            domainHash: this.formatHash(domainSeparator),
            messageHash: this.formatHash(messageHash),
            safeTxHash: safeTxHash
        };
    }
    // Main function to fetch and calculate transaction hashes
    async calculateSafeTxHashes(network: NetworkType, address: string, nonce: number): Promise<{
        domainHash: string;
        messageHash: string; 
        safeTxHash: string;
    }> {
        console.log(`[SafeHashes] Starting hash calculation for network: ${network}, address: ${address}, nonce: ${nonce}`);
        
        // Validate inputs
        this.validateNetwork(network);
        this.validateAddress(address);
        this.validateNonce(nonce);

        const apiUrl = API_URLS[network];
        const chainId = CHAIN_IDS[network];
        const endpoint = `${apiUrl}/api/v1/safes/${address}/multisig-transactions/?nonce=${nonce}`;
        
        console.log(`[SafeHashes] Fetching transaction data from: ${endpoint}`);

        try {
            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.count === 0) {
                throw new Error("No transaction is available for this nonce!");
            }

            // Use the first transaction by default (index 0)
            const tx = data.results[0];

            const params = {
                chainId,
                address,
                to: tx.to || ethers.ZeroAddress,
                value: tx.value || "0",
                data: tx.data || "0x",
                operation: tx.operation || "0",
                safeTxGas: tx.safeTxGas || "0",
                baseGas: tx.baseGas || "0",
                gasPrice: tx.gasPrice || "0",
                gasToken: tx.gasToken || ethers.ZeroAddress,
                refundReceiver: tx.refundReceiver || ethers.ZeroAddress,
                nonce: tx.nonce
            };

            const result = this.calculateHashes(params);
            console.log('[SafeHashes] Successfully calculated hashes:', result);
            return result;
        } catch (error: unknown) {
            console.error('[SafeHashes] Error calculating hashes:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to fetch or process transaction: ${error.message}`);
            }
            throw new Error('Failed to fetch or process transaction: Unknown error');
        }
    }
}

export default SafeTransactionCalculator;
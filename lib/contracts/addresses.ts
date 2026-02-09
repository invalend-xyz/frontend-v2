// Auto-generated contract configuration
// Generated on: Sun Feb 9 2026
// Network: Base Sepolia (84532)

export const NETWORK_CONFIG = {
  chainId: 84532,
  name: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
  explorerUrl: "https://sepolia.basescan.org",
  blockExplorerUrl: "https://sepolia.basescan.org",
} as const;

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  BASE_SEPOLIA: 84532,
} as const;

// Import ABI files and their addresses
import {
  MOCK_USDC_ABI,
  MOCK_USDC_ADDRESS,
} from "@/lib/contracts/abis/mock-usdc-abi";
import {
  MOCK_ETH_ABI,
  MOCK_ETH_ADDRESS,
} from "@/lib/contracts/abis/mock-eth-abi";
import {
  MOCK_BTC_ABI,
  MOCK_BTC_ADDRESS,
} from "@/lib/contracts/abis/mock-btc-abi";
import {
  LENDING_POOL_ABI,
  LENDING_POOL_ADDRESS,
} from "@/lib/contracts/abis/lending-pool-abi";
import {
  COLLATERAL_MANAGER_ABI,
  COLLATERAL_MANAGER_ADDRESS,
} from "@/lib/contracts/abis/collateral-manager-abi";
import {
  LOAN_MANAGER_ABI,
  LOAN_MANAGER_ADDRESS,
} from "@/lib/contracts/abis/loan-manager-abi";
import {
  RESTRICTED_WALLET_FACTORY_ABI,
  RESTRICTED_WALLET_FACTORY_ADDRESS,
} from "@/lib/contracts/abis/restricted-wallet-factory-abi";

// Contract configurations for wagmi - using addresses from ABI files
export const CONTRACT_CONFIGS = {
  MOCK_USDC: {
    address: MOCK_USDC_ADDRESS as `0x${string}`,
    abi: MOCK_USDC_ABI,
  },
  MOCK_ETH: {
    address: MOCK_ETH_ADDRESS as `0x${string}`,
    abi: MOCK_ETH_ABI,
  },
  MOCK_BTC: {
    address: MOCK_BTC_ADDRESS as `0x${string}`,
    abi: MOCK_BTC_ABI,
  },
  LENDING_POOL: {
    address: LENDING_POOL_ADDRESS as `0x${string}`,
    abi: LENDING_POOL_ABI,
  },
  COLLATERAL_MANAGER: {
    address: COLLATERAL_MANAGER_ADDRESS as `0x${string}`,
    abi: COLLATERAL_MANAGER_ABI,
  },
  RESTRICTED_WALLET_FACTORY: {
    address: RESTRICTED_WALLET_FACTORY_ADDRESS as `0x${string}`,
    abi: RESTRICTED_WALLET_FACTORY_ABI,
  },
  LOAN_MANAGER: {
    address: LOAN_MANAGER_ADDRESS as `0x${string}`,
    abi: LOAN_MANAGER_ABI,
  },
} as const;

